import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800 h-[100dvh]">
            <Sidebar />
            <main className="flex-1 flex flex-col md:ml-0">
                <ChatArea />
                <ChatInput />
            </main>
        </div>
    );
}
