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
    const { sessions, activeId, open, loading } = useChatStore();
    const { currentId } = useChatNavigation();
    const chatIdFromUrl = currentId();
    const currentChatId = chatIdFromUrl || activeId;
    const currentChat = currentChatId ? sessions[currentChatId] : initialChat;
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
            open(chatIdFromUrl).catch(console.error);
            initializedRef.current = true;
        } else if (chatIdFromUrl && activeId !== chatIdFromUrl) {
            useChatStore.setState({ activeId: chatIdFromUrl });
        }
    }, [chatIdFromUrl, initialChat, open, sessions, activeId]);

    return (
        <div className="flex flex-col flex-1">
            <ChatHeader />
            {loading ? (
                <ChatLoader />
            ) : (
                <ChatArea chat={currentChat} />
            )}
            <ChatInput chatId={currentChatId} />
        </div>
    );
}