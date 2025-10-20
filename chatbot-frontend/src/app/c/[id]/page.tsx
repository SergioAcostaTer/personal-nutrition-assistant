import { container } from "@/composition/container";
import ChatPage from "@/ui/ChatPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatSSRPage({ params }: { params: { id: string } }) {
    try {
        const chat = await container.openSession.execute(params.id);
        return <ChatPage initialChat={chat} />;
    } catch {
        notFound();
    }
}
