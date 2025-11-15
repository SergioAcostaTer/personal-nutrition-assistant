// ============================================
// FILE: src/ui/ChatPage.tsx
// ============================================
"use client";

import { useChatStore } from "@/application/store/useChatStore";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatLoader from "./ChatLoader";

interface Props {
    chatId?: string;
}

export default function ChatPage({ chatId }: Props) {
    const { sessions, loading, errors } = useChatStore();

    const currentChat = chatId ? sessions[chatId] : undefined;
    const isLoading = chatId ? loading[chatId] : false;
    const error = chatId ? errors[chatId] : undefined;

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
            <ChatInput chatId={chatId} />
        </div>
    );
}