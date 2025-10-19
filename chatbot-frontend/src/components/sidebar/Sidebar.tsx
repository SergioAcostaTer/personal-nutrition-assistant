"use client";

import { PanelRightOpen, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // 🧭 Detect viewport size
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 768;
            setIsDesktop(desktop);
            if (desktop) setIsMobileOpen(false); // auto-close overlay on desktop
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 📏 Width logic
    const sidebarWidth = isDesktop
        ? isCollapsed
            ? "md:w-[68px]"
            : "md:w-[260px]"
        : "w-[260px]";

    return (
        <>
            {/* 📱 Mobile open button */}
            {!isDesktop && !isMobileOpen && (
                <button
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#202123] text-gray-100 hover:bg-[#2a2b32] shadow-lg"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <PanelRightOpen size={20} />
                </button>
            )}

            {/* 📱 Backdrop for mobile */}
            {!isDesktop && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 🧱 Sidebar */}
            <aside
                className={`
          h-screen bg-[#202123] text-gray-100 flex flex-col transition-all duration-300 ease-in-out
          border-r border-[#3e3f4b] z-50
          ${isDesktop ? "static" : "fixed top-0 left-0"}
          ${isMobileOpen || isDesktop ? "translate-x-0" : "-translate-x-full"}
          ${sidebarWidth}
        `}
            >
                {/* Header (controls collapse and mobile close) */}
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* Main content area */}
                <nav className="flex-1 px-2 overflow-y-auto space-y-2">
                    <SidebarButton
                        icon={<Plus size={18} className="text-gray-100" />}
                        label="New Chat"
                        onClick={() => console.log("New Chat")}
                        collapsed={isDesktop && isCollapsed}
                    />

                    <SidebarButton
                        icon={<Search size={16} className="text-gray-100" />}
                        label="Search"
                        onClick={() => console.log("Search")}
                        collapsed={isDesktop && isCollapsed}
                    />

                    {/* Add your sidebar items or chat list here */}
                </nav>

                {/* Footer */}
                <SidebarFooter
                    isCollapsed={isDesktop && isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
            </aside>
        </>
    );
}
