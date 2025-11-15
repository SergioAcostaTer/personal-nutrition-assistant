// ============================================
// FILE: src/ui/ChatInput.tsx (PROFESSIONAL VERSION)
// ============================================
import { useChatStore } from "@/application/store/useChatStore";
import { Paperclip, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";

interface Props {
    chatId?: string;
}

export default function ChatInput({ chatId }: Props) {
    const [message, setMessage] = useState("");
    const [isSending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { createSession, sendMessage } = useChatStore();
    const router = useRouter();

    // Auto-resize textarea
    const adjustHeight = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;

        requestAnimationFrame(() => {
            el.style.height = "auto";
            const maxHeight = 200;
            el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
        });
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [message, adjustHeight]);

    const handleSend = () => {
        const text = message.trim();
        if (!text || isSending) return;

        setMessage("");

        startTransition(() => {
            if (!chatId) {
                createSession(text).then((id) => {
                    router.push(`/c/${id}`);
                });
            } else {
                sendMessage(chatId, text);
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handlePaste = () => {
        setTimeout(adjustHeight, 0);
    };

    return (
        <div
            className="px-4 py-3 bg-[var(--color-background)]"
            style={{
                position: "sticky",
                bottom: 0,
                paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
                paddingTop: "6px",
                background: "var(--color-background)",
                zIndex: 50,
            }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-3xl shadow-sm px-4 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-md transition-all">
                    <button
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] transition-colors flex-shrink-0"
                        aria-label="Attach file"
                        type="button"
                    >
                        <Paperclip size={20} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.5] placeholder:text-[var(--color-foreground)] placeholder:opacity-40 text-[var(--color-foreground)] max-h-[200px] py-[6px]"
                        value={message}
                        placeholder="Message ChatBot..."
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        rows={1}
                        disabled={isSending}
                    />

                    <button
                        className="flex-shrink-0 p-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
                        onClick={handleSend}
                        disabled={!message.trim() || isSending}
                        aria-label="Send message"
                        type="button"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
