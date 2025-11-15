"use client";

import { useChatStore } from "@/application/store/useChatStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatLoader from "./ChatLoader";

interface Props {
    chatId?: string;
}

export default function ChatPage({ chatId }: Props) {
    const router = useRouter();

    const sessions = useChatStore(state => state.sessions);
    const loading = useChatStore(state => state.loading);

    const currentChat = chatId ? sessions[chatId] : undefined;
    const isLoading = chatId ? loading[chatId] : false;

    useEffect(() => {
        if (chatId && !currentChat && !isLoading) {
            router.push("/");
        }
    }, [chatId, currentChat, isLoading, router]);

    return (
        <div className="flex flex-col max-h-screen flex-1">
            <ChatHeader />
            {isLoading ? <ChatLoader /> : <ChatArea chat={currentChat} />}
            <ChatInput chatId={chatId} />
        </div>
    );
}
