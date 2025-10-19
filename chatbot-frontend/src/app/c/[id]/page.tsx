import ChatArea from "@/components/chat/ChatArea";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function ChatPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <div className="flex h-[100svh] overflow-hidden bg-[var(--color-background)]">
            <Sidebar />
            <main className="flex flex-1 flex-col">
                <ChatHeader />
                <ChatArea chatId={id} />
                <ChatInput chatId={id} />
            </main>
        </div>
    );
}
