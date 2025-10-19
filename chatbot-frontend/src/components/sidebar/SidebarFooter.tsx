"use client";

import { ChevronUp, HelpCircle, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FooterProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
};

export const SidebarFooter = ({ isCollapsed }: FooterProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Avoid overflow problems in collapsed mode by disabling the dropdown.
    const dropdownEnabled = !isCollapsed;

    return (
        <div className="relative border-t border-[var(--color-border)] p-2" ref={containerRef}>
            {/* Popup Menu */}
            {dropdownEnabled && (
                <div
                    className={[
                        "absolute bottom-full left-2 right-2 mb-2 rounded-lg border border-[var(--color-border)]",
                        "bg-[var(--color-card)] shadow-xl overflow-hidden",
                        "transition-all duration-200",
                        isMenuOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 translate-y-2 pointer-events-none",
                    ].join(" ")}
                >
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                        <HelpCircle size={16} />
                        <span>Help &amp; FAQ</span>
                    </button>
                </div>
            )}

            {/* Profile Button */}
            <button
                className={[
                    "w-full flex items-center rounded-lg px-3 py-2.5 hover:bg-[var(--color-card)] transition-colors",

                ].join(" ")}
                onClick={() => dropdownEnabled && setIsMenuOpen((v) => !v)}
                aria-expanded={dropdownEnabled ? isMenuOpen : undefined}
                aria-haspopup={dropdownEnabled ? "menu" : undefined}
                aria-label="Account menu"
            >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
                    <User size={18} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Animated identity block */}
                <div
                    className={[
                        "flex-1 text-left",
                        "transition-all duration-200",
                        isCollapsed
                            ? "opacity-0 -translate-x-2 w-0 max-w-0 overflow-hidden pointer-events-none"
                            : "opacity-100 translate-x-0 w-auto max-w-full",
                    ].join(" ")}
                >
                    <div className="text-sm font-medium text-[var(--color-foreground)]">Guest User</div>
                    <div className="text-xs text-[var(--color-foreground)] opacity-50">Free plan</div>
                </div>

                {!isCollapsed && (
                    <ChevronUp
                        size={16}
                        className={[
                            "text-[var(--color-foreground)] transition-transform",
                            isMenuOpen ? "rotate-180" : "",
                        ].join(" ")}
                    />
                )}
            </button>
        </div>
    );
};
