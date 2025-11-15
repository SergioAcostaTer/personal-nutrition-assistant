// src/ui/ChatPage.tsx
"use client";

import { useChatSession } from "@/hooks/useChatSession";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatLoader from "./ChatLoader";

interface Props {
    chatId?: string;
}

export default function ChatPage({ chatId }: Props) {
    const { chat: currentChat, isLoading } = useChatSession(chatId);

    return (
        <div
            className="flex flex-col overflow-x-hidden overflow-y-auto"
            style={{ height: "100svh" }}
        >
            <ChatHeader />
            {isLoading ? <ChatLoader /> : <ChatArea chat={currentChat} />}
            <ChatInput chatId={chatId} />
        </div>
    );
}
