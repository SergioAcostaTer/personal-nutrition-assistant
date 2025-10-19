import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SidebarHeaderProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (value: boolean) => void;
};

function Logo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.105v-5.678a.79.79 0 00-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08L8.704 5.46a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
    );
}

export const SidebarHeader = ({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}: SidebarHeaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Close mobile sidebar on outside click
    useEffect(() => {
        if (!isMobileOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsMobileOpen?.(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileOpen, setIsMobileOpen]);

    return (
        <div
            ref={containerRef}
            className="h-16 px-2 flex items-center justify-between flex-shrink-0 border-b border-[#3e3f4b] transition-all ease-in-out-smooth"
        >
            {/* Logo + Label group */}
            <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setIsCollapsed(!isCollapsed)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsCollapsed(!isCollapsed);
                    }
                }}
                aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
                className={`flex items-center px-2 py-2 rounded-lg hover:bg-[#2a2b32] transition-all ease-in-out-smooth cursor-pointer
          ${isCollapsed ? "justify-center w-[68px]" : "justify-start gap-2 w-full"}`}
            >
                {(hovered && isCollapsed) ? (
                    <ChevronRight
                        size={24}
                        className="text-gray-100 flex-shrink-0 transition-transform duration-fast"
                    />
                ) : (
                    <Logo className="h-6 w-6 text-gray-100 flex-shrink-0" />
                )}

                {/* Text transitions in/out */}
                <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out-smooth ${isCollapsed
                        ? "max-w-0 opacity-0 -translate-x-1"
                        : "max-w-[120px] opacity-100 translate-x-0"
                        }`}
                >
                    <span className="text-gray-100 text-sm font-medium whitespace-nowrap">
                        Your App
                    </span>
                </div>
            </button>

            {/* Right-side controls (hidden when collapsed) */}
            <div
                className={`flex items-center gap-1 transition-all duration-200 ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
            >
                {/* Desktop collapse button */}
                <button
                    className="p-2 rounded-lg hover:bg-[#2a2b32] transition-all ease-in-out-smooth md:block hidden"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft
                        size={20}
                        className={`text-gray-100 transition-transform ${hovered ? "scale-110" : "scale-100"
                            }`}
                    />
                </button>

                {/* Mobile close button */}
                <button
                    className="p-2 rounded-lg hover:bg-[#2a2b32] transition-all ease-in-out-smooth md:hidden"
                    onClick={() => setIsMobileOpen?.(false)}
                    aria-label="Close sidebar"
                >
                    <X size={20} className="text-gray-100" />
                </button>
            </div>
        </div>
    );
};
