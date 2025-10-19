"use client";
import { useShortcut } from "@/hooks/useShortcut";

type ButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    collapsed: boolean;
    shortcut?: string[];
};

export const SidebarButton = ({
    icon,
    label,
    onClick,
    collapsed,
    shortcut,
}: ButtonProps) => {
    useShortcut(shortcut, onClick);

    return (
        <button
            onClick={onClick}
            title={label + (shortcut ? ` (${shortcut.join(" + ")})` : "")}
            className={`group relative w-full flex items-center px-3 py-2 rounded-lg hover:bg-[#2a2b32] transition-colors cursor-pointer`}
        >
            {/* Icon */}
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
                {icon}
            </div>

            {/* Label */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out`}
                style={{
                    maxWidth: collapsed ? 0 : 200,
                    opacity: collapsed ? 0 : 1,
                    marginLeft: collapsed ? 0 : 12,
                }}
            >
                <span className="text-sm text-gray-100 whitespace-nowrap">
                    {label}
                </span>
            </div>

            {/* Shortcut shown on hover */}
            {(shortcut && shortcut.length > 0 && !collapsed) && (
                <div
                    className={`
                        absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                    `}
                >
                    {shortcut.join(" + ")}
                </div>
            )}
        </button>
    );
};
