"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Apple, PanelLeftClose, X } from "lucide-react";

type SidebarHeaderProps = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (value: boolean) => void;
};

export const SidebarHeader = ({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}: SidebarHeaderProps) => {
    return (
        <div className="flex h-14 items-center border-b border-[var(--color-border)] px-2">
            {/* Collapse / Expand Button (Logo area) */}
            <button
                className={[
                    "flex items-center rounded-lg px-2 py-2 hover:bg-[var(--color-card)] transition-colors duration-200",
                    "w-full md:w-auto justify-start gap-2",
                ].join(" ")}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {/* Logo Icon */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex-shrink-0"
                >
                    <Apple size={20} className="text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Animated Title (only visible when expanded) */}
                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.span
                            key="title"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.25 }}
                            className="font-semibold text-[var(--color-foreground)] whitespace-nowrap overflow-hidden"
                        >
                            NutriAI
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Collapse Icon (visible only when expanded) */}
                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.div
                            key="collapse-icon"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="ml-auto hidden md:flex text-[var(--color-foreground)]"
                        >
                            <PanelLeftClose size={18} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Mobile close button */}
            {isMobileOpen && (
                <button
                    className="ml-auto p-2 rounded-lg hover:bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors md:hidden"
                    onClick={() => setIsMobileOpen?.(false)}
                    aria-label="Close sidebar"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};
