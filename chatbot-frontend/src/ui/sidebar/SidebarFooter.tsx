"use client";

import { ChevronUp, HelpCircle, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FooterProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
};

export const SidebarFooter = ({ isCollapsed }: FooterProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownEnabled = !isCollapsed;

    return (
        <div
            ref={ref}
            className="relative border-t border-[var(--color-border)] p-2 transition-all duration-300"
        >
            {/* Dropdown Menu */}
            {dropdownEnabled && (
                <div
                    className={[
                        "absolute bottom-full left-2 right-2 mb-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl overflow-hidden transition-all duration-300 ease-in-out",
                        isMenuOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 translate-y-2 pointer-events-none",
                    ].join(" ")}
                >
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors">
                        <HelpCircle size={16} />
                        <span>Help & FAQ</span>
                    </button>
                </div>
            )}

            {/* Profile Section */}
            <button
                onClick={() => dropdownEnabled && setIsMenuOpen((v) => !v)}
                aria-label="User menu"
                className={[
                    "group relative w-full flex items-center rounded-lg px-3 py-2.5 hover:bg-[var(--color-card)] transition-colors ease-in-out duration-200",
                ].join(" ")}
            >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex-shrink-0">
                    <User size={18} className="text-white" strokeWidth={2.5} />
                </div>

                {/* Animated text block — absolutely positioned to prevent layout jump */}
                <div
                    className={[
                        "absolute left-14 right-3 flex items-center justify-between transition-all ease-in-out duration-300",
                        isCollapsed
                            ? "opacity-0 translate-x-[-4px]"
                            : "opacity-100 translate-x-0 delay-100",
                    ].join(" ")}
                >
                    <div className="flex flex-col text-left">
                        <div className="text-sm font-medium text-[var(--color-foreground)]">
                            Guest User
                        </div>
                        <div className="text-xs text-[var(--color-foreground)] opacity-50">
                            Free plan
                        </div>
                    </div>

                    <ChevronUp
                        size={16}
                        className={[
                            "text-[var(--color-foreground)] transition-transform duration-300",
                            isMenuOpen ? "rotate-180" : "",
                        ].join(" ")}
                    />
                </div>
            </button>
        </div>
    );
};
