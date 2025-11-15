// ============================================
// FILE: src/ui/ChatPage.tsx
// ============================================
"use client";

import { useChatStore } from "@/application/store/useChatStore";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatLoader from "./ChatLoader";
import ErrorScreen from "./ErrorScreen";

interface Props {
    chatId?: string;
}

export default function ChatPage({ chatId }: Props) {
    const { sessions, errors } = useChatStore();

    const currentChat = chatId ? sessions[chatId] : undefined;
    const error = chatId ? errors[chatId] : undefined;
    const isLoading = chatId ? useChatStore.getState().loading[chatId] : false;

    return (
        <div className="flex flex-col max-h-screen flex-1">
            <ChatHeader />
            {error ? (
                <ErrorScreen message={error} />
            ) : isLoading ? (
                <ChatLoader />
            ) : (
                <ChatArea chat={currentChat} />
            )}
            <ChatInput chatId={chatId} />
        </div>
    );
}
