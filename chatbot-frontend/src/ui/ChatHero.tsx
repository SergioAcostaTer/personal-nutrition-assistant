import { Code, HelpCircle, Lightbulb, Sparkles } from "lucide-react";

const suggestions = [
    { icon: Lightbulb, text: "Explain quantum computing simply" },
    { icon: Code, text: "Write a Python script" },
    { icon: Sparkles, text: "Plan a trip to Japan" },
    { icon: HelpCircle, text: "How do I learn React?" },
];

const ChatHeroCard = ({
    icon: Icon,
    text,
    handleSuggestionClick,
    className
}: {
    icon: typeof Code;
    text: string;
    handleSuggestionClick: (text: string) => void;
    className?: string;
}) => (
    <button
        className={`group p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-secondary)] transition-all duration-200 text-left ${className}`}
        onClick={() => handleSuggestionClick(text)}
    >
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10 group-hover:bg-opacity-15 transition-all">
                <Icon size={20} className="text-[var(--color-foreground)]" />
            </div>
            <h3 className="text-[var(--color-foreground)] font-medium group-hover:underline flex-1">
                {text}
            </h3>
        </div>
    </button>
);



export default function ChatHero({ handleSuggestionClick }: { handleSuggestionClick: (text: string) => void }) {
    return (
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)]">
            <div className="mx-auto px-3 py-6 sm:py-12 flex flex-col items-center justify-center min-h-full w-full max-w-sm sm:max-w-3xl">

                <div className="mb-4 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow">
                        <Sparkles size={28} className="text-white" />
                    </div>
                </div>

                <h1 className="text-xl sm:text-3xl font-semibold mb-2 text-[var(--color-foreground)] text-center leading-tight">
                    How can I help you today?
                </h1>

                <p className="text-[var(--color-foreground)] opacity-60 mb-6 sm:mb-10 text-center text-sm sm:text-lg leading-snug max-w-xs sm:max-w-sm">
                    Your intelligent AI assistant for any task
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full">
                    {suggestions.map((s, i) => (
                        <ChatHeroCard
                            key={i}
                            icon={s.icon}
                            text={s.text}
                            className={i > 1 ? "hidden sm:block" : ""}
                            handleSuggestionClick={handleSuggestionClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
