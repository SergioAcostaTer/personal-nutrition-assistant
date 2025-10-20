import { container } from "@/composition/container";
import ChatPage from "@/ui/ChatPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatSSRPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    try {
        const { id } = await params;
        const chat = await container.openSession.execute(id);
        return <ChatPage initialChat={chat} />;
    } catch {
        notFound();
    }
}
