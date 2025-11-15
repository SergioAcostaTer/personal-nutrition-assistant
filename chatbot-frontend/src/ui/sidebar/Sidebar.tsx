// ============================================
// FILE: src/ui/sidebar/Sidebar.tsx
// OPTIMIZED: Fast loading, proper async handling
// ============================================
"use client";
import { useChatStore } from "@/application/store/useChatStore";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Plus, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

interface Props {
    initialList?: { id: string; title: string; lastMessageAt?: string }[];
}

export default function Sidebar({ initialList = [] }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { sidebar, bootstrap } = useChatStore();
    const {
        isCollapsed,
        isMobileOpen,
        isDesktop,
        setCollapsed,
        setMobileOpen,
        setDesktop,
    } = useSidebarStore();

    // Initialize sidebar data
    useEffect(() => {
        if (!sidebar.length && initialList.length) {
            // Use SSR data immediately
            useChatStore.setState({ sidebar: initialList });
        } else if (!sidebar.length) {
            // Load from API (non-blocking)
            bootstrap().catch(err => {
                console.warn("Failed to load chats:", err);
            });
        }
    }, [sidebar.length, initialList, bootstrap]);

    const [hydrated, setHydrated] = useState(false);

    // Detect screen size for responsive behavior
    useLayoutEffect(() => {
        const desktop = window.innerWidth >= 768;
        setDesktop(desktop);
        setHydrated(true);
        if (desktop) setMobileOpen(false);

        const handleResize = () => {
            const isNowDesktop = window.innerWidth >= 768;
            setDesktop(isNowDesktop);
            if (isNowDesktop) setMobileOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setDesktop, setMobileOpen]);

    const handleNewChat = () => {
        router.push("/");
        if (!isDesktop) setMobileOpen(false);
    };

    const handleChatClick = (chatId: string) => {
        router.push(`/c/${chatId}`);
        if (!isDesktop) setMobileOpen(false);
    };

    // Use SSR data if sidebar is empty
    const chats = sidebar.length ? sidebar : initialList;
    const sidebarWidth = isDesktop ? (isCollapsed ? "w-16" : "w-64") : "w-64";
    const activeChatId = pathname?.startsWith("/c/") ? pathname.slice(3) : undefined;

    // Prevent hydration mismatch
    if (!hydrated) {
        return <aside className="w-64 h-screen bg-[var(--color-sidebar-bg)]" />;
    }

    return (
        <>
            {/* Mobile overlay */}
            {!isDesktop && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={[
                    "h-screen flex flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar-bg)] z-50",
                    "transition-transform duration ease-out will-change-transform",
                    isDesktop ? "static" : "fixed top-0 left-0 transform-gpu",
                    isDesktop ? "" : isMobileOpen ? "translate-x-0" : "-translate-x-full",
                    sidebarWidth,
                ].join(" ")}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setMobileOpen}
                />

                {/* Actions */}
                <div className="px-2 py-3 space-y-3 flex-shrink-0">
                    <SidebarButton
                        icon={<Plus size={18} />}
                        label="New chat"
                        onClick={handleNewChat}
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
                </div>

                {/* Chat list */}
                <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${activeChatId === chat.id
                                    ? "bg-[var(--color-secondary)] font-medium"
                                    : "hover:bg-[var(--color-card)]"
                                }`}
                        >
                            <span className="truncate text-[var(--color-foreground)]">{chat.title}</span>
                        </li>
                    ))}
                </ul>

                <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setCollapsed} />
            </aside>
        </>
    );
}