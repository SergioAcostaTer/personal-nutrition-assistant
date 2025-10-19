"use client";

import { Apple, PanelLeftClose, X } from "lucide-react";

type SidebarHeaderProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (value: boolean) => void;
};

export const SidebarHeader = ({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}: SidebarHeaderProps) => {
    return (
        <div className="flex h-14 items-center border-b border-[var(--color-border)] px-2">
            {/* Collapse / Expand toggle (logo area) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="relative flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[var(--color-card)] transition-all duration ease-in-out flex-1 md:flex-none"
            >
                {/* Logo icon (never moves) */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex-shrink-0 transition-transform duration">
                    <Apple size={20} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Label (absolute — fades/slides smoothly) */}
                <div
                    className={[
                        "absolute left-12 right-3 flex items-center justify-between transition-all ease-in-out duration",
                        isCollapsed
                            ? "opacity-0 translate-x-[-4px]"
                            : "opacity-100 translate-x-0 delay-100",
                    ].join(" ")}
                >
                    <span className="font-semibold text-[var(--color-foreground)] whitespace-nowrap pointer-events-none">
                        NutriAI
                    </span>

                    {/* Collapse icon (desktop only) */}
                    <PanelLeftClose
                        size={18}
                        className="hidden md:block text-[var(--color-foreground)] transition-transform duration hover:rotate-6"
                    />
                </div>
            </button>

            {/* Mobile Close Button (visible when open) */}
            <button
                className={[
                    "ml-auto md:hidden p-2 rounded-lg text-[var(--color-foreground)] transition-all duration",
                    isMobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none",
                    "hover:bg-[var(--color-card)]",
                ].join(" ")}
                onClick={() => setIsMobileOpen?.(false)}
                aria-label="Close sidebar"
            >
                <X size={18} />
            </button>
        </div>
    );
};
