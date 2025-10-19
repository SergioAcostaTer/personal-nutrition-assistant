"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { useThemeStore } from "@/lib/store/themeStore";
import { Menu, Moon, Sun } from "lucide-react";

export default function ChatHeader() {
    const { isDesktop, toggleMobileOpen } = useSidebarStore();
    const { mode, toggleMode } = useThemeStore();

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-30 h-14">
            {/* Left: Menu Button (Mobile) */}
            {!isDesktop && (
                <button
                    onClick={toggleMobileOpen}
                    aria-label="Open sidebar"
                    className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] transition-colors"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Center: Model Info */}
            <div className="flex-1 flex items-center justify-center gap-2">
                <span className="font-semibold text-[var(--color-foreground)] text-sm">
                    NutriAI
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] rounded-full">
                    GPT-4
                </span>
            </div>

            {/* Right: Theme Toggle */}
            <button
                onClick={toggleMode}
                aria-label="Toggle theme"
                className="p-2 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] transition-colors"
            >
                {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
        </header>
    );
}