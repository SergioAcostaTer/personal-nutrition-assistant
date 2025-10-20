"use client";
import { useChatStore } from "@/application/store/useChatStore";
import { useChatNavigation } from "@/hooks/useChatNavigation";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Plus, Search } from "lucide-react";
import { useEffect } from "react";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

interface Props {
    initialList?: { id: string; title: string; lastMessageAt?: string }[];
}

export default function Sidebar({ initialList = [] }: Props) {
    const { sidebar, bootstrap, newChat, open } = useChatStore();
    const { goToChat, currentId } = useChatNavigation();
    const activeChatId = currentId();
    const {
        isCollapsed,
        isMobileOpen,
        isDesktop,
        setCollapsed,
        setMobileOpen,
        setDesktop,
    } = useSidebarStore();

    useEffect(() => {
        if (!sidebar.length && initialList.length) {
            useChatStore.setState({ sidebar: initialList });
        } else if (!sidebar.length) {
            bootstrap().catch(console.error);
        }
    }, [sidebar.length, initialList, bootstrap]);

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

    const handleNew = async () => {
        const id = await newChat();
        goToChat(id); // Navigate instantly
        if (!isDesktop) setMobileOpen(false);
    };

    const handleChatClick = (chatId: string) => {
        // Navigate instantly
        goToChat(chatId);
        // Trigger background load
        open(chatId);
        // Close mobile sidebar
        if (!isDesktop) setMobileOpen(false);
    };

    const chats = sidebar.length ? sidebar : initialList;
    const sidebarWidth = isDesktop ? (isCollapsed ? "w-16" : "w-64") : "w-64";

    return (
        <>
            {!isDesktop && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={() => setMobileOpen(false)}
                />
            )}

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

                <div className="px-2 py-3 space-y-3 flex-shrink-0">
                    <SidebarButton
                        icon={<Plus size={18} />}
                        label="New chat"
                        onClick={handleNew}
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

                <ul className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                                ${activeChatId === chat.id
                                    ? "bg-[var(--color-secondary)] font-medium"
                                    : "hover:bg-[var(--color-card)]"
                                }`}
                        >
                            <span className="truncate">{chat.title}</span>
                        </li>
                    ))}
                </ul>

                <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setCollapsed} />
            </aside>
        </>
    );
}