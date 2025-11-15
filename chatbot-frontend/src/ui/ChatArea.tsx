import { useChatStore } from "@/application/store/useChatStore";
import { ChatSession } from "@/domain/model/ChatSession";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ChatHero from "./ChatHero";

export default function ChatArea({ chat }: { chat?: ChatSession }) {
    const router = useRouter();
    const { createSession } = useChatStore();
    const { isDesktop, setMobileOpen } = useSidebarStore();

    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chat?.messages?.length) return;
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }, [chat?.messages?.length]);

    const handleSuggestionClick = (text: string) => {
        if (!isDesktop) setMobileOpen(false);
        createSession(text).then((id) => router.push(`/c/${id}`));
    };

    if (!chat) return <ChatHero handleSuggestionClick={handleSuggestionClick} />;

    const messages = chat.messages ?? [];

    return (
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)] px-4 py-6">
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
