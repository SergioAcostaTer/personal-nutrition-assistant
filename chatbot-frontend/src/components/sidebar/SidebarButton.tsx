"use client";

import { useShortcut } from "@/hooks/useShortcut";

type ButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    collapsed: boolean;
    shortcut?: string[];
    variant?: "default" | "primary";
};

export const SidebarButton = ({
    icon,
    label,
    onClick,
    collapsed,
    shortcut,
    variant = "default",
}: ButtonProps) => {
    useShortcut(shortcut, onClick);

    const base =
        "w-full flex items-center rounded-lg px-3 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]";
    const visual =
        variant === "primary"
            ? "border border-[var(--color-border)] hover:bg-[var(--color-card)] font-medium"
            : "hover:bg-[var(--color-card)]";
    const layout = collapsed ? "justify-center" : "gap-3";

    return (
        <button
            onClick={onClick}
            title={label + (shortcut ? ` (${shortcut.join(" + ")})` : "")}
            className={[base, visual, layout].join(" ")}
            aria-label={label}
        >
            <div className="flex items-center justify-center text-[var(--color-foreground)]">
                {icon}
            </div>

            {/* Animated label */}
            <span
                className={[
                    "text-sm text-[var(--color-foreground)] text-left flex-1",
                    "transition-all duration-200",
                    collapsed
                        ? "opacity-0 -translate-x-2 w-0 max-w-0 overflow-hidden pointer-events-none"
                        : "opacity-100 translate-x-0 w-auto max-w-full",
                ].join(" ")}
            >
                {label}
            </span>

            {/* Shortcut hint */}
            {shortcut && shortcut.length > 0 && (
                <div
                    className={[
                        "text-xs text-[var(--color-foreground)] opacity-40",
                        "transition-all duration-200",
                        collapsed
                            ? "opacity-0 -translate-x-2 w-0 max-w-0 overflow-hidden pointer-events-none"
                            : "opacity-100 translate-x-0 w-auto max-w-full",
                    ].join(" ")}
                >
                    {shortcut.join(" + ")}
                </div>
            )}
        </button>
    );
};
