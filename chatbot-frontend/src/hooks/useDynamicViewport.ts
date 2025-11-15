// src/hooks/useDynamicViewport.ts
"use client";

import { useEffect } from "react";

export function useDynamicViewport() {
    useEffect(() => {
        const update = () => {
            const vh = window.visualViewport?.height || window.innerHeight;
            document.documentElement.style.setProperty("--app-height", `${vh}px`);
        };

        update();

        window.visualViewport?.addEventListener("resize", update);
        window.visualViewport?.addEventListener("scroll", update);
        window.addEventListener("orientationchange", update);

        return () => {
            window.visualViewport?.removeEventListener("resize", update);
            window.visualViewport?.removeEventListener("scroll", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);
}
