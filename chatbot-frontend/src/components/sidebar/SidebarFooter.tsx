import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FooterProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
};

export const SidebarFooter = ({ isCollapsed, setIsCollapsed }: FooterProps) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        if (isCollapsed) {
            // Expand sidebar first, then open dropdown slightly delayed for smoothness
            setIsCollapsed(false);
            setTimeout(() => setIsProfileMenuOpen(true), 150);
        } else {
            setIsProfileMenuOpen(!isProfileMenuOpen);
        }
    };

    return (
        <div className="p-2 border-t border-[#3e3f4b] flex-shrink-0 relative" ref={containerRef}>
            <div className="relative">
                <button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2a2b32] transition-colors cursor-pointer"
                    onClick={handleProfileClick}
                >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white">U</span>
                    </div>

                    {/* Animated name */}
                    <div
                        className={`flex-1 text-left overflow-hidden transition-all duration ease-in-out ${isCollapsed
                            ? "max-w-0 opacity-0 ml-0"
                            : "max-w-[150px] opacity-100 ml-1"
                            }`}
                    >
                        <div className="text-sm font-medium text-gray-100">User</div>
                    </div>

                    <ChevronDown
                        size={16}
                        className={`text-gray-300 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* Dropdown */}
                <div
                    className={`absolute bottom-full left-0 right-0 mb-2 bg-[#202123] border border-[#3e3f4b] rounded-lg shadow-xl overflow-hidden transition-all duration ease-in-out ${isProfileMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                >
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 transition text-sm text-gray-100 hover:bg-[#2a2b32]">
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>
                    <div className="border-t border-[#3e3f4b]" />
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 transition text-sm text-red-400 hover:bg-[#2a2b32]">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
