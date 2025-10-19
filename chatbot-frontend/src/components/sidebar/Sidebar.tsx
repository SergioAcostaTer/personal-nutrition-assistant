"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Plus, Search } from "lucide-react";
import { useEffect } from "react";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export default function Sidebar() {
    const {
        isCollapsed,
        isMobileOpen,
        isDesktop,
        setCollapsed,
        setMobileOpen,
        setDesktop,
    } = useSidebarStore();

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

    const sidebarWidth = isDesktop
        ? isCollapsed
            ? "w-16"
            : "w-64"
        : "w-64";

    return (
        <>
            {!isDesktop && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                        }`}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={[
                    "h-screen flex flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar-bg)] z-50",
                    "transition-all duration-300 ease-in-out will-change-transform",
                    isDesktop ? "static" : "fixed top-0 left-0 transform-gpu",
                    isDesktop
                        ? ""
                        : isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full",
                    sidebarWidth,
                    "overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
                ].join(" ")}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setMobileOpen}
                />

                <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-3">
                    <SidebarButton
                        icon={<Plus size={18} />}
                        label="New chat"
                        onClick={() => console.log("New Chat")}
                        collapsed={isCollapsed}
                        variant="primary"
                        shortcut={["Ctrl", "Shift", "N"]}
                    />

                    <SidebarButton
                        icon={<Search size={18} />}
                        label="Search"
                        onClick={() => console.log("Search")}
                        collapsed={isCollapsed}
                        shortcut={["Ctrl", "Shift", "F"]}
                    />

                    {!isCollapsed && (
                        <div className="mt-4 space-y-1">
                            <p className="px-3 text-xs font-semibold text-[var(--color-foreground)] opacity-50">
                                Recent chats
                            </p>
                            {[
                                "Meal prep ideas",
                                "High protein recipes",
                                "Macro calculator",
                                "Vitamin D guide",
                            ].map((title, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-secondary)] text-sm text-[var(--color-foreground)] truncate transition-colors"
                                    onClick={() => console.log("Open chat:", title)}
                                >
                                    <span className="truncate">{title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setCollapsed} />
            </aside>
        </>
    );
}
