"use client";

import { container } from "@/composition/container";
import { ChatSession } from "@/domain/model/ChatSession";
import { create } from "zustand";

type SidebarItem = { id: string; title: string; lastMessageAt?: string };

interface State {
    sidebar: SidebarItem[];
    sessions: Record<string, ChatSession>;
    activeId?: string;
    loading: boolean;

    bootstrap(): Promise<void>;
    open(id: string): Promise<void>;
    newChat(firstMessage?: string): Promise<string>;
    send(text: string): Promise<void>;
    rename(id: string, title: string): Promise<void>;
    remove(id: string): Promise<void>;
}

export const useChatStore = create<State>((set, get) => ({
    sidebar: [],
    sessions: {},
    activeId: undefined,
    loading: false,

    async bootstrap() {
        const list = await container.listSessions.execute();
        set({ sidebar: list });
    },

    async open(id: string) {
        set({ loading: true });
        try {
            const chat = await container.openSession.execute(id);
            set(s => ({ sessions: { ...s.sessions, [id]: chat }, activeId: id }));
        } finally {
            set({ loading: false });
        }
    },

    async newChat(firstMessage?: string) {
        const id = crypto.randomUUID();
        const created = await container.createSession.execute(id, "New Chat");
        set(s => ({
            sessions: { ...s.sessions, [id]: created },
            sidebar: [{ id, title: created.title, lastMessageAt: created.lastMessageAt }, ...s.sidebar],
            activeId: id,
        }));
        if (firstMessage?.trim()) {
            await get().send(firstMessage.trim());
        }
        return id;
    },

    async send(text: string) {
        const sessionId = get().activeId;
        if (!sessionId) throw new Error("No active session");
        const userText = text.trim();
        if (!userText) return;

        await container.sendMessage.execute({
            sessionId,
            userText,
            onUserAccepted: (user) => set(s => {
                const c = s.sessions[sessionId] ?? { id: sessionId, title: "New Chat", messages: [] };
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, user] } } };
            }),
            onAssistantDraftCreated: (_draftId, draft) => set(s => {
                const c = s.sessions[sessionId]!;
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, draft] } } };
            }),
            onAssistantDelta: (_draftId, delta) => set(s => {
                const c = s.sessions[sessionId]!;
                const msgs = c.messages.slice();
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: msgs[msgs.length - 1].content + delta };
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: msgs } } };
            }),
            onAssistantDone: async () => {
                // Update sidebar lastMessageAt and title (if needed)
                const sess = get().sessions[sessionId];
                const last = sess.messages.at(-1)?.createdAt ?? new Date().toISOString();
                set(s => ({
                    sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, lastMessageAt: last } : it)
                }));
            },
            maybeGenerateTitle: async (firstUserText) => {
                const sess = get().sessions[sessionId];
                if (!sess.title || sess.title === "New Chat") {
                    const title = await container.chatSvc.generateTitle(sessionId, firstUserText);
                    await container.renameSession.execute(sessionId, title);
                    set(s => ({
                        sessions: { ...s.sessions, [sessionId]: { ...s.sessions[sessionId]!, title } },
                        sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, title } : it),
                    }));
                }
            },
            batchingMs: 16,
        });
    },

    async rename(id, title) {
        await container.renameSession.execute(id, title);
        set(s => ({
            sessions: { ...s.sessions, [id]: { ...s.sessions[id], title } },
            sidebar: s.sidebar.map(it => (it.id === id ? { ...it, title } : it)),
        }));
    },

    async remove(id) {
        await container.deleteSession.execute(id);
        set(s => ({
            sidebar: s.sidebar.filter(it => it.id !== id),
            sessions: Object.fromEntries(Object.entries(s.sessions).filter(([k]) => k !== id)),
            activeId: s.activeId === id ? undefined : s.activeId,
        }));
    },
}));
