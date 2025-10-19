"use client";

import { Paperclip, Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ChatInput() {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // detect if we’re inside an existing chat
    const chatId = pathname.startsWith("/c/") ? pathname.split("/c/")[1] : null;

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        const maxHeight = 200;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);

        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY =
            textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [message, adjustHeight]);

    const handleSend = useCallback(async () => {
        if (!message.trim()) return;

        const text = message.trim();
        setMessage("");

        // if we’re not in a chat, create a new one and replace path
        if (!chatId) {
            const newId = uuidv4();
            router.replace(`/c/${newId}`);
            console.log("Created new chat:", newId, "with first message:", text);
            return;
        }

        // normal message send
        console.log("Send:", { chatId, text });
        // TODO: hook this up to chat store or API
    }, [message, chatId, router]);

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
        <div className="bg-[var(--color-background)] px-4 py-4">
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-3xl shadow-sm px-4 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-md transition-all">
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
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.5] placeholder:text-[var(--color-foreground)] placeholder:opacity-40 text-[var(--color-foreground)] max-h-[200px] py-[6px]"
                        value={message}
                        placeholder="Message NutriAI..."
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    {/* Send Button */}
                    <button
                        className="flex-shrink-0 p-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
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
