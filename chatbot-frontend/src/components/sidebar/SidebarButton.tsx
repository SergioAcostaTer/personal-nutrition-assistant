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
        "group relative flex items-center rounded-lg px-3 py-2.5 transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]";
    const visual =
        variant === "primary"
            ? "border border-[var(--color-border)] hover:bg-[var(--color-card)] font-medium"
            : "hover:bg-[var(--color-card)]";

    return (
        <button
            onClick={onClick}
            title={label + (shortcut ? ` (${shortcut.join(' + ')})` : '')}
            aria-label={label}
            className={[base, visual, "w-full overflow-hidden"].join(" ")}
        >
            {/* Icon — fixed position, never moves */}
            <div className="flex items-center justify-center text-[var(--color-foreground)] flex-shrink-0">
                {icon}
            </div>

            {/* Animated label (absolutely positioned to avoid flex jumps) */}
            <div
                className={[
                    "absolute left-10 right-3 flex items-center justify-between pointer-events-none transition-all duration-300 ease-in-out",
                    collapsed
                        ? "opacity-0 translate-x-[-4px]"
                        : "opacity-100 translate-x-0 delay-100",
                ].join(" ")}
            >
                <span className="text-sm text-[var(--color-foreground)] truncate pointer-events-none">
                    {label}
                </span>

                {/* Shortcut hint — only visible on hover */}
                {shortcut && shortcut.length > 0 && (
                    <div className="text-xs text-[var(--color-foreground)] opacity-0 group-hover:opacity-40 transition-opacity ease-in-out duration-200">
                        {shortcut.join(" + ")}
                    </div>
                )}
            </div>
        </button>
    );
};
