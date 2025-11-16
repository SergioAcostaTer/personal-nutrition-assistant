"use client";

import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useSendMessage } from "@/hooks/useSendMessage";
import { Paperclip, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface Props {
    chatId?: string;
}

export default function ChatInput({ chatId }: Props) {
    const router = useRouter();
    const [text, setText] = useState("");
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);

    const { send, isSending } = useSendMessage(chatId);
    const { bind, resize } = useAutoResizeTextarea<HTMLTextAreaElement>();

    const disabled = isPending || isSending;

    // Ajustar posición del input cuando aparece el teclado
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const vvh = window.visualViewport?.height || window.innerHeight;
            const offset = window.innerHeight - vvh;

            containerRef.current.style.transform = `translateY(-${offset}px)`;
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        window.visualViewport?.addEventListener('scroll', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
        };
    }, []);

    const handleSend = () => {
        const message = text.trim();
        if (!message || disabled) return;

        setText("");

        startTransition(() => {
            send(message).then((newId) => {
                if (!chatId) router.push(`/c/${newId}`);
            });
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onPaste = () => {
        setTimeout(resize, 0);
    };

    const handleFocus = () => {
        // Scroll automático al input cuando se enfoca
        setTimeout(() => {
            containerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }, 300);
    };

    return (
        <div
            ref={containerRef}
            className="px-4 py-4 transition-transform duration-200 ease-out"
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
                background: `
                    linear-gradient(
                        to top,
                        rgba(0, 0, 0, 0.55) 0%,
                        rgba(0, 0, 0, 0.35) 50%,
                        rgba(0, 0, 0, 0.1) 75%,
                        rgba(0, 0, 0, 0) 100%
                    )
                `,
            }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-3xl shadow-lg px-4 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-xl transition-all">
                    <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)] flex-shrink-0"
                        aria-label="Attach file"
                        disabled={disabled}
                    >
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        {...bind}
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.5] placeholder:opacity-40 max-h-[200px] py-[6px]"
                        value={text}
                        placeholder="Message ChatBot..."
                        onChange={(e) => {
                            setText(e.target.value);
                            resize();
                        }}
                        onKeyDown={onKeyDown}
                        onPaste={onPaste}
                        onFocus={handleFocus}
                        rows={1}
                        disabled={disabled}
                    />

                    <button
                        type="button"
                        onClick={handleSend}
                        aria-label="Send message"
                        disabled={!text.trim() || disabled}
                        className="flex-shrink-0 p-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-40"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}