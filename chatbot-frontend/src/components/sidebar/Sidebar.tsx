"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { History, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

// Mock conversation history
const mockHistory = [
    { id: 1, title: "Meal prep ideas for beginners", date: "Today" },
    { id: 2, title: "High protein vegetarian recipes", date: "Today" },
    { id: 3, title: "Macro calculations for weight loss", date: "Yesterday" },
    { id: 4, title: "Benefits of Mediterranean diet", date: "Yesterday" },
    { id: 5, title: "Vitamin D supplementation guide", date: "Last 7 days" },
    { id: 6, title: "Best pre-workout nutrition", date: "Last 7 days" },
];

export default function Sidebar() {
    const {
        isCollapsed,
        isMobileOpen,
        isDesktop,
        setCollapsed,
        setMobileOpen,
        setDesktop,
    } = useSidebarStore();

    const [conversations, setConversations] = useState(mockHistory);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // Responsive breakpoint tracking
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setDesktop(desktop);
            if (desktop) setMobileOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setDesktop, setMobileOpen]);

    const handleDelete = (id: number) => {
        setConversations((prev) => prev.filter((c) => c.id !== id));
    };

    const groupedConversations = useMemo(() => {
        return conversations.reduce((acc, conv) => {
            if (!acc[conv.date]) acc[conv.date] = [];
            acc[conv.date].push(conv);
            return acc;
        }, {} as Record<string, typeof conversations>);
    }, [conversations]);

    const sidebarWidthClass = isDesktop
        ? isCollapsed
            ? "w-16" // 64px collapsed
            : "w-64" // 256px expanded
        : "w-64"; // mobile drawer width

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && isMobileOpen && (
                <button
                    aria-label="Close sidebar overlay"
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                role="navigation"
                aria-label="Primary"
                className={[
                    "h-screen flex flex-col border-r border-[var(--color-border)]",
                    "bg-[var(--color-sidebar-bg)] z-50",
                    "transition-[transform,width] duration-300 ease-in-out",
                    isDesktop ? "static" : "fixed top-0 left-0",
                    isMobileOpen || isDesktop ? "translate-x-0" : "-translate-x-full",
                    sidebarWidthClass,
                    "overflow-hidden", // prevents any content leakage when collapsed
                ].join(" ")}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setMobileOpen}
                />

                <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-3">
                    {/* New Chat */}
                    <SidebarButton
                        icon={<Plus size={18} />}
                        label="New chat"
                        onClick={() => console.log("New Chat")}
                        collapsed={isCollapsed}
                        variant="primary"
                        shortcut={["Ctrl", "Shift", "O"]}
                    />

                    {/* Search */}
                    <SidebarButton
                        icon={<Search size={18} />}
                        label="Search"
                        onClick={() => console.log("Search")}
                        collapsed={isCollapsed}
                        shortcut={["Ctrl", "K"]}
                    />

                    {/* Conversation History */}
                    <div className="space-y-3">
                        {Object.entries(groupedConversations).map(([date, convs]) => (
                            <div key={date}>
                                {/* Section header hidden when collapsed */}
                                <h3
                                    className={[
                                        "px-3 text-xs font-semibold text-[var(--color-foreground)] opacity-50",
                                        "transition-all duration-200",
                                        isCollapsed
                                            ? "h-0 opacity-0 -translate-y-1 sr-only" // visually hide to keep a11y quiet & avoid spacing
                                            : "h-5 translate-y-0",
                                    ].join(" ")}
                                >
                                    {date}
                                </h3>

                                <div className="mt-1 space-y-1">
                                    {convs.map((conv) => (
                                        <div
                                            key={conv.id}
                                            className="group relative"
                                            onMouseEnter={() => setHoveredId(conv.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <button
                                                className={[
                                                    "w-full flex items-center rounded-lg px-3 py-2.5 text-left",
                                                    "hover:bg-[var(--color-card)] transition-colors",
                                                    isCollapsed ? "justify-center" : "gap-3",
                                                ].join(" ")}
                                                onClick={() =>
                                                    console.log("Open conversation", conv.id)
                                                }
                                            >
                                                <History
                                                    size={16}
                                                    className="flex-shrink-0 text-[var(--color-foreground)] opacity-60"
                                                />
                                                <span
                                                    className={[
                                                        "text-sm text-[var(--color-foreground)] truncate flex-1",
                                                        "transition-all duration-200",
                                                        isCollapsed
                                                            ? "opacity-0 -translate-x-2 w-0 max-w-0 overflow-hidden pointer-events-none"
                                                            : "opacity-100 translate-x-0 w-auto max-w-full",
                                                    ].join(" ")}
                                                >
                                                    {conv.title}
                                                </span>
                                            </button>

                                            {/* Delete button only when expanded (prevents overflow in collapsed) */}
                                            {!isCollapsed && hoveredId === conv.id && (
                                                <button
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500/10 text-[var(--color-foreground)] hover:text-red-500 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(conv.id);
                                                    }}
                                                    aria-label="Delete conversation"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setCollapsed} />
            </aside>
        </>
    );
}
