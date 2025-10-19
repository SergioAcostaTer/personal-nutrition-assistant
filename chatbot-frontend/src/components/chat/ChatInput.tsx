"use client";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatInput() {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight || "0", 10);
        const maxHeight = lineHeight * 6;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);

        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [message, adjustHeight]);

    const handleSend = useCallback(() => {
        if (!message.trim()) return;
        console.log("Send:", message);
        setMessage("");
    }, [message]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    return (
        <div className="w-full border-t border-gray-200 bg-gray-50 px-4 py-3 flex flex-col items-center">
            <div className="relative w-full max-w-3xl flex items-center bg-white border border-gray-300 rounded-2xl shadow-sm p-2">
                <textarea
                    ref={textareaRef}
                    id="chat-input"
                    className="flex-1 resize-none bg-transparent outline-none text-sm leading-normal placeholder:text-gray-400 text-gray-800"
                    value={message}
                    placeholder="Send a message..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    style={{
                        minHeight: "1.5rem",
                        paddingTop: "0.25rem",
                    }}
                />
                <button
                    className="ml-2 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    aria-label="Send message"
                >
                    <ArrowUp size={16} />
                </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-500 text-center">
                This chat can make mistakes. Check important info.
            </p>
        </div>
    );
}
