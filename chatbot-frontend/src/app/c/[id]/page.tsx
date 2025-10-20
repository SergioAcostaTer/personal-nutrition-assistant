import { container } from "@/composition/container";
import ChatPage from "@/ui/ChatPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatSSRPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // 👇 if using mock (localStorage-based), skip SSR open
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
        return <ChatPage />;
    }

    try {
        const chat = await container.openSession.execute(id);
        return <ChatPage initialChat={chat} />;
    } catch {
        notFound();
    }
}
