"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { useThemeStore } from "@/lib/store/themeStore";
import { Menu, Moon, Share2, Sun } from "lucide-react";

export default function ChatHeader() {
    const { isDesktop, toggleMobileOpen } = useSidebarStore();
    const { mode, toggleMode } = useThemeStore();

    return (
        <header
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-card)] shadow-sm sticky top-0 z-30"
        >
            {/* Left: Open Sidebar (Mobile only) */}
            {!isDesktop && (
                <button
                    onClick={toggleMobileOpen}
                    aria-label="Open sidebar"
                    className="p-2 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-foreground)]"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Center: Model name */}
            <div className="flex-1 text-center">
                <h2 className="font-semibold text-[var(--color-foreground)] text-base sm:text-lg">
                    MyChat – GPT-4
                </h2>
                <p className="text-[11px] text-gray-400 leading-tight">powered by OpenAI</p>
            </div>

            {/* Right: Theme + Share */}
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleMode}
                    aria-label="Toggle theme"
                    className="p-2 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-foreground)]"
                >
                    {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button
                    onClick={() => console.log("Share chat")}
                    className="p-2 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-foreground)]"
                    aria-label="Share conversation"
                >
                    <Share2 size={18} />
                </button>
            </div>
        </header>
    );
}
