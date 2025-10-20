import { useChatStore } from "@/application/store/useChatStore";
import { ChatSession } from "@/domain/model/ChatSession";
import { useChatNavigation } from "@/hooks/useChatNavigation";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Apple, BookOpen, Calculator, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

const suggestions = [
    { icon: Apple, text: "Suggest a healthy breakfast" },
    { icon: Calculator, text: "Calculate my daily calories" },
    { icon: BookOpen, text: "Meal plan for muscle gain" },
    { icon: Sparkles, text: "Benefits of omega-3?" },
];

export default function ChatArea({ chat }: { chat?: ChatSession }) {
    const { send, newChat } = useChatStore();
    const { goToChat } = useChatNavigation();
    const { isDesktop, setMobileOpen } = useSidebarStore();
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages?.length]);

    const handleSuggestionClick = async (text: string) => {
        // Close mobile sidebar when suggestion is clicked
        if (!isDesktop) {
            setMobileOpen(false);
        }

        if (!chat?.id) {
            const id = await newChat(text);
            goToChat(id);
        } else {
            await send(text);
        }
    };

    if (!chat) {
        return (
            <div className="flex-1 overflow-y-auto bg-[var(--color-background)] max-w-screen">
                <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-full">
                    <div className="mb-8 relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow">
                            <Apple size={32} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-background)] flex items-center justify-center">
                            <Sparkles size={12} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-semibold mb-3 text-[var(--color-foreground)] text-center">
                        How can I help you today?
                    </h1>
                    <p className="text-[var(--color-foreground)] opacity-60 mb-12 text-center text-lg">
                        Your personal nutrition assistant powered by AI
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                className="group p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-secondary)] transition-all duration-200 text-left"
                                onClick={() => handleSuggestionClick(s.text)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10 group-hover:bg-opacity-15 transition-all">
                                        <s.icon size={20} className="text-[var(--color-foreground)]" />
                                    </div>
                                    <h3 className="text-[var(--color-foreground)] font-medium group-hover:underline flex-1">
                                        {s.text}
                                    </h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)] px-4 py-6 max-w-screen">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
                {chat.messages.map((m, i) => (
                    <div
                        key={i}
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