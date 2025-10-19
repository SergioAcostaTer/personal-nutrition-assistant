"use client";

import { Apple, BookOpen, Calculator, Sparkles } from "lucide-react";

const suggestions = [
    {
        icon: Apple,
        title: "Meal Planning",
        description: "Create a balanced meal plan for the week",
    },
    {
        icon: Calculator,
        title: "Calorie Tracking",
        description: "Calculate macros for my fitness goals",
    },
    {
        icon: BookOpen,
        title: "Recipe Ideas",
        description: "Suggest healthy recipes with chicken",
    },
    {
        icon: Sparkles,
        title: "Nutrition Advice",
        description: "What are the benefits of omega-3?",
    },
];

export default function ChatArea() {
    return (
        <div className="flex-1 overflow-y-auto bg-[var(--color-background)]">
            <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-full">
                <div className="mb-8 relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                        <Apple size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-background)] flex items-center justify-center shadow-sm">
                        <Sparkles size={12} className="text-white" />
                    </div>
                </div>

                <h1 className="text-4xl font-semibold mb-3 text-[var(--color-foreground)] text-center">
                    How can I help you today?
                </h1>
                <p className="text-[var(--color-foreground)] opacity-60 mb-12 text-center text-lg">
                    Your personal nutrition assistant powered by AI
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className="group p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-secondary)] transition-all duration-200 text-left hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                            onClick={() => console.log('Clicked:', suggestion.title)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10 group-hover:bg-opacity-15 transition-all">
                                    <suggestion.icon
                                        size={20}
                                        className="text-[var(--color-primary)]"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--color-foreground)] mb-1">
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-foreground)] opacity-60 line-clamp-2">
                                        {suggestion.description}
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
