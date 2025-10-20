"use client";
import { useChatStore } from "@/application/store/useChatStore";
import { useChatNavigation } from "@/hooks/useChatNavigation";
import { Paperclip, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    chatId?: string;
}

export default function ChatInput({ chatId }: Props) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const { send, newChat } = useChatStore();
    const { goToChat } = useChatNavigation();

    const adjustHeight = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        const maxHeight = 200;
        el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    }, []);
    useEffect(adjustHeight, [message]);

    const handleSend = async () => {
        const text = message.trim();
        if (!text) return;
        setMessage("");
        if (!chatId) {
            const id = await newChat(text);
            goToChat(id); // silent URL update, no route transition
        } else {
            await send(text);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="bg-[var(--color-background)] px-4 py-4">
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-3xl shadow-sm px-4 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-md transition-all">
                    <button
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] transition-colors flex-shrink-0"
                        aria-label="Attach file"
                        onClick={() => console.log("Attach file")}
                    >
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.5] placeholder:text-[var(--color-foreground)] placeholder:opacity-40 text-[var(--color-foreground)] max-h-[200px] py-[6px]"
                        value={message}
                        placeholder="Message NutriAI..."
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />

                    <button
                        className="flex-shrink-0 p-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
                        onClick={handleSend}
                        disabled={!message.trim()}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>

                <p className="mt-3 text-xs text-center text-[var(--color-foreground)] opacity-50">
                    NutriAI can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
}
