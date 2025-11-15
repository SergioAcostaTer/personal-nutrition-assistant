// ============================================
// FILE: src/hooks/useDynamicViewport.ts
// ============================================
"use client";
import { useEffect } from "react";

export function useDynamicViewport() {
    useEffect(() => {
        const update = () => {
            const height = window.innerHeight;
            document.documentElement.style.setProperty(
                "--app-height",
                `${height}px`
            );
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);
}
