"use client";

import { Paperclip, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatInput() {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        const maxHeight = 200;
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
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4">
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-3xl shadow-sm px-4 py-3 focus-within:border-[var(--color-primary)] focus-within:shadow-md transition-all">
                    {/* Attachment Button */}
                    <button
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] transition-colors flex-shrink-0"
                        aria-label="Attach file"
                        onClick={() => console.log("Attach file")}
                    >
                        <Paperclip size={20} />
                    </button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-6 placeholder:text-[var(--color-foreground)] placeholder:opacity-40 text-[var(--color-foreground)] max-h-[200px]"
                        value={message}
                        placeholder="Message NutriAI..."
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    {/* Send Button */}
                    <button
                        className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
                        onClick={handleSend}
                        disabled={!message.trim()}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Footer Text */}
                <p className="mt-3 text-xs text-center text-[var(--color-foreground)] opacity-50">
                    NutriAI can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
}