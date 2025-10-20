import { container } from "@/composition/container";
import ChatPage from "@/ui/ChatPage";
import { notFound } from "next/navigation";

export default async function ChatSSRPage({ params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const chat = await container.openSession.execute(id);
        // ✅ Preload data on server
        return <ChatPage initialChat={chat} />;
    } catch {
        notFound();
    }
}
