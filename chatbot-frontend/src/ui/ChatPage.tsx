"use client";
import { useChatStore } from "@/application/store/useChatStore";
import { ChatSession } from "@/domain/model/ChatSession";
import { useChatNavigation } from "@/hooks/useChatNavigation";
import { useEffect, useRef } from "react";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatLoader from "./ChatLoader";

interface Props {
    initialChat?: ChatSession;
}

export default function ChatPage({ initialChat }: Props) {
    const { sessions, activeId, open, loading, errors } = useChatStore();
    const { currentId } = useChatNavigation();
    const chatIdFromUrl = currentId();
    const currentChatId = chatIdFromUrl || activeId;
    const currentChat = currentChatId ? sessions[currentChatId] : initialChat;
    const isLoading = currentChatId ? loading[currentChatId] : false;
    const error = currentChatId ? errors[currentChatId] : undefined;
    const initializedRef = useRef(false);

    useEffect(() => {
        // Prevent double initialization in dev mode (React StrictMode)
        if (initializedRef.current) return;

        if (initialChat && !sessions[initialChat.id]) {
            useChatStore.setState((s) => ({
                sessions: { ...s.sessions, [initialChat.id]: initialChat },
                activeId: initialChat.id,
            }));
            initializedRef.current = true;
        } else if (chatIdFromUrl && !sessions[chatIdFromUrl]) {
            // This will navigate instantly and load in background
            open(chatIdFromUrl).catch(console.error);
            initializedRef.current = true;
        } else if (chatIdFromUrl && activeId !== chatIdFromUrl) {
            useChatStore.setState({ activeId: chatIdFromUrl });
        }
    }, [chatIdFromUrl, initialChat, open, sessions, activeId]);

    return (
        <div className="flex flex-col flex-1">
            <ChatHeader />
            {error ? (
                <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
                    <div className="flex flex-col items-center gap-3 max-w-md text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                            {error}
                        </h2>
                        <p className="text-sm text-[var(--color-foreground)] opacity-60">
                            This chat could not be loaded. It may have been deleted or you may not have access to it.
                        </p>
                    </div>
                </div>
            ) : isLoading ? (
                <ChatLoader />
            ) : (
                <ChatArea chat={currentChat} />
            )}
            <ChatInput chatId={currentChatId} />
        </div>
    );
}