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
            ? "md:w-[68px]"
            : "md:w-[260px]"
        : "w-[260px]";

    return (
        <>
            {!isDesktop && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`
          h-screen flex flex-col transition-all duration-300 ease-in-out
          border-r border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] z-50
          ${isDesktop ? "static" : "fixed top-0 left-0"}
          ${isMobileOpen || isDesktop ? "translate-x-0" : "-translate-x-full"}
          ${sidebarWidth}
        `}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setMobileOpen}
                />

                <nav className="flex-1 px-2 overflow-y-auto space-y-2">
                    <SidebarButton
                        icon={<Plus size={18} className="text-[var(--color-foreground)]" />}
                        label="New Chat"
                        onClick={() => console.log("New Chat")}
                        collapsed={isDesktop && isCollapsed}
                    />

                    <SidebarButton
                        icon={<Search size={16} className="text-[var(--color-foreground)]" />}
                        label="Search"
                        onClick={() => console.log("Search")}
                        collapsed={isDesktop && isCollapsed}
                    />
                </nav>

                <SidebarFooter
                    isCollapsed={isDesktop && isCollapsed}
                    setIsCollapsed={setCollapsed}
                />
            </aside>
        </>
    );
}
