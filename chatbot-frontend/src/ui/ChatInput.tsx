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

    return (
        <div className="bg-background border-t border-border px-4 py-3">
            <div className="max-w-3xl mx-auto flex items-end gap-3">
                <button
                    onClick={() => console.log("Attach")}
                    className="p-2 text-foreground/70 hover:bg-secondary rounded-lg"
                >
                    <Paperclip size={18} />
                </button>

                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    rows={1}
                    placeholder="Message NutriAI..."
                    className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-relaxed placeholder:text-foreground/40 text-foreground max-h-[200px]"
                />

                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="p-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
