import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
    return (
        <div className="flex h-[100svh] overflow-hidden bg-gray-100 text-gray-800">
            <Sidebar />
            <main className="flex flex-1 flex-col">
                <ChatArea />
                <ChatInput />
            </main>
        </div>
    );
}
