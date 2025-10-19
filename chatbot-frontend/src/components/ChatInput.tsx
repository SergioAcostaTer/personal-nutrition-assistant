"use client";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export default function ChatInput() {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        console.log("Send:", message);
        setMessage("");
    };

    return (
        <div className="p-4 flex flex-col items-center shrink-0 bg-gray-50 border-t border-gray-200">
            <div className="mb-2 w-full max-w-2xl flex flex-row p-2 rounded-xl border border-gray-300 bg-white shadow-sm">
                <textarea
                    id="chat-input"
                    className="w-full p-2 rounded-md resize-none outline-none"
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleSend}
                >
                    <ArrowUp size={16} />
                </button>
            </div>
            <p className="text-xs text-gray-500">
                AI can make mistakes. Please verify critical information.
            </p>
        </div>
    );
}
