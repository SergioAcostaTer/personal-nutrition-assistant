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
    variant = "default"
}: ButtonProps) => {
    useShortcut(shortcut, onClick);

    const baseClasses = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all";
    const variantClasses = variant === "primary"
        ? "border border-[var(--color-border)] hover:bg-[var(--color-card)] font-medium"
        : "hover:bg-[var(--color-card)]";

    return (
        <button
            onClick={onClick}
            title={label + (shortcut ? ` (${shortcut.join(" + ")})` : "")}
            className={`${baseClasses} ${variantClasses}`}
        >
            <div className="flex items-center justify-center text-[var(--color-foreground)]">
                {icon}
            </div>

            {!collapsed && (
                <span className="text-sm text-[var(--color-foreground)] flex-1 text-left">
                    {label}
                </span>
            )}

            {shortcut && shortcut.length > 0 && !collapsed && (
                <div className="text-xs text-[var(--color-foreground)] opacity-40">
                    {shortcut.join("+")}
                </div>
            )}
        </button>
    );
};