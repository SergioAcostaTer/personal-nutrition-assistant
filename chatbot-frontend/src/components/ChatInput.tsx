"use client";
import { useState } from "react";

export default function ChatInput() {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        console.log("Send:", message);
        setMessage("");
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="mb-2 w-full max-w-2xl flex flex-row p-2 rounded-xl border border-gray-300 bg-white">
                <textarea
                    className="w-full p-2 rounded-md resize-none"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </div>
            <p className="text-xs text-gray-500">
                AI can make mistakes. Please verify critical information.
            </p>
        </div>
    );
}
