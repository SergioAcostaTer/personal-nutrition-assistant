"use client";

import { useChatActions } from "@/hooks/useChatActions";
import { useChatStore } from "@/lib/store/chatStore";
import { Apple, BookOpen, Calculator, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const suggestions = [
    { icon: Apple, title: "Meal Planning", description: "Create a balanced meal plan for the week" },
    { icon: Calculator, title: "Calorie Tracking", description: "Calculate macros for my fitness goals" },
    { icon: BookOpen, title: "Recipe Ideas", description: "Suggest healthy recipes with chicken" },
    { icon: Sparkles, title: "Nutrition Advice", description: "What are the benefits of omega-3?" },
];

export default function ChatArea({ chatId }: { chatId?: string }) {
    const { chats, addMessage } = useChatStore();
    const router = useRouter();
    const pathname = usePathname();
    const { sendMessage } = useChatActions();

    const currentChatId =
        chatId || (pathname.startsWith("/c/") ? pathname.split("/c/")[1] : null);

    const messages = currentChatId ? chats[currentChatId] || [] : [];

    const handleSuggestionClick = async (text: string) => {
        if (!currentChatId) {
            const newId = uuidv4();
            addMessage(newId, { role: "user", content: text });
            router.replace(`/c/${newId}`);
            setTimeout(() => sendMessage(newId, text), 100);
        } else {
            sendMessage(currentChatId, text);
        }
    };

    if (!currentChatId || messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto bg-[var(--color-background)]">
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
                                onClick={() => handleSuggestionClick(s.title)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10 group-hover:bg-opacity-15 transition-all">
                                        <s.icon size={20} className="text-[var(--color-foreground)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[var(--color-foreground)] mb-1">
                                            {s.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-foreground)] opacity-60 line-clamp-2">
                                            {s.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)] px-4 py-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
                {messages.map((m, i) => (
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
            </div>
        </div>
    );
}
