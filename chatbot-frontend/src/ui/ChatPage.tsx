"use client";
import { useChatStore } from "@/application/store/useChatStore";
import { ChatSession } from "@/domain/model/ChatSession";
import { useChatNavigation } from "@/hooks/useChatNavigation";
import { useEffect } from "react";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

interface Props {
    initialChat?: ChatSession;
}

export default function ChatPage({ initialChat }: Props) {
    const { sessions, activeId, open } = useChatStore();
    const { currentId } = useChatNavigation();
    const chatIdFromUrl = currentId();
    const currentChatId = chatIdFromUrl || activeId;
    const currentChat = currentChatId ? sessions[currentChatId] : initialChat;

    useEffect(() => {
        if (initialChat && !sessions[initialChat.id]) {
            useChatStore.setState((s) => ({
                sessions: { ...s.sessions, [initialChat.id]: initialChat },
                activeId: initialChat.id,
            }));
        } else if (chatIdFromUrl && (!sessions[chatIdFromUrl] || activeId !== chatIdFromUrl)) {
            open(chatIdFromUrl).catch(console.error);
        }
    }, [chatIdFromUrl, initialChat, open, sessions, activeId]);

    return (
        <div className="flex flex-col flex-1">
            <ChatHeader />
            <ChatArea chat={currentChat} />
            <ChatInput chatId={currentChatId} />
        </div>
    );
}
