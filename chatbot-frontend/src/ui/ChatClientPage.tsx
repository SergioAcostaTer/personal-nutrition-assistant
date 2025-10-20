"use client";

import { useChatStore } from "@/application/store/useChatStore";
import ChatPage from "@/ui/ChatPage";
import { useEffect } from "react";

export default function ChatClientPage({ id }: { id: string }) {
    const { sessions, open, activeId } = useChatStore();

    useEffect(() => {
        if (!id) return;
        if (!sessions[id]) {
            open(id).catch(console.error);
        } else if (activeId !== id) {
            useChatStore.setState({ activeId: id });
        }
    }, [id, sessions, activeId, open]);

    return <ChatPage />;
}
