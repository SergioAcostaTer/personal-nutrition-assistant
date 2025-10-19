"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { History, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
        setConversations(conversations.filter(c => c.id !== id));
    };

    const groupedConversations = conversations.reduce((acc, conv) => {
        if (!acc[conv.date]) acc[conv.date] = [];
        acc[conv.date].push(conv);
        return acc;
    }, {} as Record<string, typeof conversations>);

    return (
        <>
            {/* Mobile Overlay */}
            {!isDesktop && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    h-screen flex flex-col transition-all duration-300 ease-in-out
                    border-r border-[var(--color-border)] bg-[var(--color-sidebar-bg)] z-50
                    ${isDesktop ? "static" : "fixed top-0 left-0"}
                    ${isMobileOpen || isDesktop ? "translate-x-0" : "-translate-x-full"}
                    ${isDesktop ? (isCollapsed ? "w-0 md:w-0" : "w-[260px]") : "w-[260px]"}
                `}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setMobileOpen}
                />

                <div className="flex-1 overflow-y-auto px-2 py-2">
                    {/* New Chat Button */}
                    <SidebarButton
                        icon={<Plus size={18} />}
                        label="New chat"
                        onClick={() => console.log("New Chat")}
                        collapsed={false}
                        variant="primary"
                    />

                    {/* Search Button */}
                    <div className="mt-2 mb-4">
                        <SidebarButton
                            icon={<Search size={18} />}
                            label="Search"
                            onClick={() => console.log("Search")}
                            collapsed={false}
                        />
                    </div>

                    {/* Conversation History */}
                    <div className="space-y-4">
                        {Object.entries(groupedConversations).map(([date, convs]) => (
                            <div key={date}>
                                <h3 className="px-3 py-1 text-xs font-semibold text-[var(--color-foreground)] opacity-50">
                                    {date}
                                </h3>
                                <div className="space-y-1 mt-1">
                                    {convs.map((conv) => (
                                        <div
                                            key={conv.id}
                                            className="group relative"
                                            onMouseEnter={() => setHoveredId(conv.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <button
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-card)] transition-colors text-left"
                                                onClick={() => console.log("Open conversation", conv.id)}
                                            >
                                                <History size={16} className="text-[var(--color-foreground)] opacity-60 flex-shrink-0" />
                                                <span className="flex-1 text-sm text-[var(--color-foreground)] truncate">
                                                    {conv.title}
                                                </span>
                                            </button>

                                            {/* Delete Button */}
                                            {hoveredId === conv.id && (
                                                <button
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500 hover:bg-opacity-10 text-[var(--color-foreground)] hover:text-red-500 transition-all"
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

                <SidebarFooter
                    isCollapsed={false}
                    setIsCollapsed={setCollapsed}
                />
            </aside>
        </>
    );
}