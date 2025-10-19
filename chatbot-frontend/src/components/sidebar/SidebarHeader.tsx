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
        <div className="h-14 px-2 flex items-center justify-between border-b border-[var(--color-border)]">
            {/* Logo + Title */}
            <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                    <Apple size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-[var(--color-foreground)]">
                    NutriAI
                </span>
            </div>

            {/* Controls */}
            <div className="flex items-center">
                {/* Desktop: Collapse Button */}
                {!isMobileOpen && (
                    <button
                        className="hidden md:flex p-2 rounded-lg hover:bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label="Collapse sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}

                {/* Mobile: Close Button */}
                {isMobileOpen && (
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors"
                        onClick={() => setIsMobileOpen?.(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};