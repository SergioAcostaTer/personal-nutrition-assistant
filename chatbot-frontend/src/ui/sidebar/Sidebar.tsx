"use client";

import { useChatStore } from "@/application/store/useChatStore";
import { ChatSession } from "@/domain/model/ChatSession";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SidebarButton } from "./SidebarButton";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

const ChatElement = ({ id, title, lastMessageAt }: Pick<ChatSession, "id" | "title" | "lastMessageAt">) => {
    return (
        <li className="flex items-center justify-between w-full">
            <div className="flex-1">
                <h4 className="font-medium">{title}</h4>
                {lastMessageAt && <p className="text-sm text-muted-foreground">{lastMessageAt}</p>}
            </div>
        </li>
    );
};

const SidebarBody = () => {
    const { sidebar, remove } = useChatStore();
    return (
        <ul className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-3">
            {sidebar.map((item: { id: string; title: string; lastMessageAt?: string }) => (
                <ChatElement
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    lastMessageAt={item.lastMessageAt}
                />
            ))}
        </ul>
    );
};

export default function Sidebar() {
    const {
        isCollapsed,
        isMobileOpen,
        isDesktop,
        setCollapsed,
        setMobileOpen,
        setDesktop,
    } = useSidebarStore();
    const router = useRouter();
    const { bootstrap } = useChatStore();
    useEffect(() => { bootstrap(); }, [bootstrap]);


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

    const sidebarWidth = isDesktop ? (isCollapsed ? "w-16" : "w-64") : "w-64";

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
                    "transition-all duration-300 ease-in-out",
                    isDesktop ? "static" : "fixed top-0 left-0 transform-gpu",
                    isDesktop
                        ? ""
                        : isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full",
                    sidebarWidth,
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
                        onClick={() => {
                            const id = uuidv4();
                            router.push(`/c/${id}`);
                        }}
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

                <SidebarBody />

                <SidebarFooter isCollapsed={isCollapsed} setIsCollapsed={setCollapsed} />
            </aside>
        </>
    );
}
