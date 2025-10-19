"use client";

import { useThemeStore } from "@/lib/store/themeStore";
import { ReactNode, useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { mode, setMode } = useThemeStore();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const preferred = stored || (systemPrefersDark ? "dark" : "light");

        setMode(preferred);

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = (e: MediaQueryListEvent) => setMode(e.matches ? "dark" : "light");
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [setMode]);

    useEffect(() => {
        document.documentElement.dataset.theme = mode;
    }, [mode]);

    return <>{children}</>;
}
