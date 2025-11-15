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
    const { sessions, loading, errors } = useChatStore();

    const currentChat = chatId ? sessions[chatId] : undefined;

    // FIXED: interpret "undefined" as "loading"
    const isLoading = chatId ? (loading[chatId] ?? true) : false;

    const error = chatId ? errors[chatId] : undefined;

    return (
        <div className="flex flex-col flex-1">
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
