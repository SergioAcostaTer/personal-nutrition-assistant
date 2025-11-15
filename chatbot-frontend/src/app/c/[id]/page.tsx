// ============================================
// FILE: src/app/c/[id]/page.tsx
// ============================================
"use client";

import { useChatStore } from "@/application/store/useChatStore";
import ChatPage from "@/ui/ChatPage";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Individual chat page - loads chat data based on URL
 */
export default function ChatIdPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const { loadSession } = useChatStore();

    useEffect(() => {
        if (id) {
            loadSession(id);
        }
    }, [id, loadSession]);

    return <ChatPage chatId={id} />;
}