"use client";

import ChatPage from "@/ui/chat/ChatPage";
import { useParams } from "next/navigation";

export default function ChatIdPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    return <ChatPage chatId={id} />;
}
