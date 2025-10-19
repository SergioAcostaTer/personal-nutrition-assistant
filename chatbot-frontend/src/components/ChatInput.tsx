"use client";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({
    accentColor = "emerald", // 💡 easily switch to 'blue', 'violet', etc.
}: {
    accentColor?: string;
}) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        console.log("Send:", message);
        setMessage("");
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message..."
                    className={`
            flex-1 rounded-2xl px-4 py-2.5
            bg-gray-100 dark:bg-gray-800
            border border-transparent
            focus:border-${accentColor}-500
            focus:ring-2 focus:ring-${accentColor}-500
            focus:outline-none
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            transition
          `}
                />
                <button
                    onClick={handleSend}
                    className={`
            flex items-center gap-2
            bg-${accentColor}-600 hover:bg-${accentColor}-700
            text-white font-medium
            px-4 py-2 rounded-2xl
            transition
          `}
                >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                </button>
            </div>
        </div>
    );
}
