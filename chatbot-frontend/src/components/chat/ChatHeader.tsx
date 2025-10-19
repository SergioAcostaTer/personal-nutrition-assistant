"use client";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import { Menu, Share2 } from "lucide-react";

export default function ChatHeader() {
    const { isDesktop, toggleMobileOpen } = useSidebarStore();

    return (
        <header
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-30"
        >
            {/* Left: Open Sidebar (Mobile only) */}
            {!isDesktop && (
                <button
                    onClick={toggleMobileOpen}
                    aria-label="Open sidebar"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Center: Model name */}
            <div className="flex-1 text-center">
                <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
                    MyChat – GPT-4
                </h2>
                <p className="text-[11px] text-gray-400 leading-tight">powered by OpenAI</p>
            </div>

            {/* Right: Share button */}
            <button
                onClick={() => console.log("Share chat")}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                aria-label="Share conversation"
            >
                <Share2 size={18} />
            </button>
        </header>
    );
}
