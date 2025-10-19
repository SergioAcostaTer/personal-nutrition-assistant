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

    return (
        <div
            className="p-2 border-t border-[var(--color-border)] relative"
            ref={containerRef}
        >
            {/* Popup Menu */}
            <div
                className={`absolute bottom-full left-2 right-2 mb-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${isMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
            >
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                    <HelpCircle size={16} />
                    <span>Help & FAQ</span>
                </button>
            </div>

            {/* Profile Button */}
            <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-card)] transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-white" strokeWidth={2.5} />
                </div>

                {!isCollapsed && (
                    <>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-[var(--color-foreground)]">
                                Guest User
                            </div>
                            <div className="text-xs text-[var(--color-foreground)] opacity-50">
                                Free plan
                            </div>
                        </div>

                        <ChevronUp
                            size={16}
                            className={`text-[var(--color-foreground)] transition-transform ${isMenuOpen ? "rotate-180" : ""
                                }`}
                        />
                    </>
                )}
            </button>
        </div>
    );
};