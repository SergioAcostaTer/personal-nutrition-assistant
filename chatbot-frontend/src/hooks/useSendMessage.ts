/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useChatStore } from "@/application/store/useChatStore";
import { container } from "@/composition/container";
import { useCallback, useRef, useState } from "react";

/**
 * Provides a UI-friendly API for sending user and streaming assistant messages.
 * Works with any chatId (existing or undefined).
 */
export function useSendMessage(chatId?: string) {
    const store = useChatStore.getState();
    const [isSending, setIsSending] = useState(false);

    const abortRef = useRef<AbortController | null>(null);

    const send = useCallback(
        async (text: string): Promise<string> => {
            const trimmed = text.trim();
            if (!trimmed || isSending) return chatId ?? "";

            setIsSending(true);

            let sessionId = chatId;

            try {
                // Create new chat if needed
                if (!sessionId) {
                    sessionId = crypto.randomUUID();
                    const now = new Date().toISOString();

                    // optimistic
                    store.sessions[sessionId] = {
                        id: sessionId,
                        title: "New Chat",
                        messages: [],
                        lastMessageAt: now,
                    };
                    useChatStore.setState({
                        sessions: { ...store.sessions },
                        sidebar: [
                            { id: sessionId, title: "New Chat", lastMessageAt: now },
                            ...store.sidebar,
                        ],
                    });

                    // Persist async
                    container.createSession.execute(sessionId);
                }

                // START STREAMING
                const controller = new AbortController();
                abortRef.current = controller;

                let draftId: string | null = null;

                await container.sendMessage.execute({
                    sessionId,
                    userText: trimmed,

                    onUserAccepted: (user) => {
                        const sess = store.sessions[sessionId!];
                        sess.messages.push(user);
                        useChatStore.setState({ sessions: { ...store.sessions } });
                    },

                    onAssistantDraftCreated: (id, draft) => {
                        draftId = id;
                        const sess = store.sessions[sessionId!];
                        sess.messages.push(draft);
                        useChatStore.setState({ sessions: { ...store.sessions } });
                    },

                    onAssistantDelta: (_, delta) => {
                        const sess = store.sessions[sessionId!];
                        const last = sess.messages[sess.messages.length - 1];
                        last.content += delta;
                        useChatStore.setState({ sessions: { ...store.sessions } });
                    },

                    onAssistantDone: () => {
                        const sess = store.sessions[sessionId!];
                        const last = sess.messages[sess.messages.length - 1]?.createdAt;
                        useChatStore.setState({
                            sidebar: store.sidebar.map((it) =>
                                it.id === sessionId ? { ...it, lastMessageAt: last } : it
                            ),
                        });
                    },

                    maybeGenerateTitle: (firstText) =>
                        container.chatSvc.generateTitle(sessionId!, firstText)
                            .then((title) => {
                                const sess = store.sessions[sessionId!];
                                sess.title = title;

                                useChatStore.setState({
                                    sessions: { ...store.sessions },
                                    sidebar: store.sidebar.map((it) =>
                                        it.id === sessionId ? { ...it, title } : it
                                    ),
                                });

                                container.renameSession.execute(sessionId!, title);
                            })
                            .catch(() => { }),

                    batchingMs: 16,
                });

                return sessionId!;
            } finally {
                setIsSending(false);
                abortRef.current = null;
            }
        },
        [chatId, isSending, store.sessions, store.sidebar]
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        setIsSending(false);
    }, []);

    return { send, cancel, isSending };
}
