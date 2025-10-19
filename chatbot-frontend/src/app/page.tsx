import ChatArea from "@/components/chat/ChatArea";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
    return (
        <div className="flex h-[100svh] overflow-hidden bg-gray-100 text-gray-800">
            <Sidebar />
            <main className="flex flex-1 flex-col">
                <ChatHeader />
                <ChatArea />
                <ChatInput />
            </main>
        </div>
    );
}
