import { ChatSession } from "@/domain/model/ChatSession";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ChatHero from "./ChatHero";

export default function ChatArea({ chat }: { chat?: ChatSession }) {
    const router = useRouter();
    const { isDesktop, setMobileOpen } = useSidebarStore();
    const { send } = useSendMessage(undefined);
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chat?.messages?.length) return;
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    }, [chat?.messages?.length]);

    const handleSuggestionClick = async (text: string) => {
        if (!isDesktop) setMobileOpen(false);
        const id = await send(text);
        router.push(`/c/${id}`);
    };

    if (!chat) {
        return <ChatHero handleSuggestionClick={handleSuggestionClick} />;
    }

    const messages = chat.messages ?? [];

    return (
        <div
            className="flex-1 overflow-y-auto px-4 py-6"
        >
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`message-enter p-3 rounded-xl max-w-[80%] ${m.role === "user"
                            ? "self-end bg-[var(--color-primary)] text-white"
                            : "self-start bg-[var(--color-card)] text-[var(--color-foreground)]"
                            }`}
                    >
                        {m.content}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
}
