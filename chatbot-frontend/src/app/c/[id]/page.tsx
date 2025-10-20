"use client";

import { useChatStore } from "@/application/store/useChatStore";
import ChatPage from "@/ui/ChatPage";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Client-only chat page — loads instantly, hydrates messages in background.
 * Perfect for fast navigation UX.
 */
export default function ChatClientPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const { sessions, open, activeId } = useChatStore();

    useEffect(() => {
        if (!id) return;
        // only open if not already loaded
        if (!sessions[id]) {
            open(id).catch(console.error);
        } else if (activeId !== id) {
            useChatStore.setState({ activeId: id });
        }
    }, [id, open, sessions, activeId]);

    return <ChatPage />;
}
