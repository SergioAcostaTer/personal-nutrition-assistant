"use client";

import { useCallback, useRef } from "react";

export function useAutoResizeTextarea<T extends HTMLTextAreaElement>() {
    const ref = useRef<T | null>(null);

    const resize = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        requestAnimationFrame(() => {
            el.style.height = "auto";
            const max = 200;
            el.style.height = Math.min(el.scrollHeight, max) + "px";
        });
    }, []);

    const bind = {
        ref: (el: T | null) => {
            ref.current = el;
            if (el) resize();
        },
    };

    return { ref, resize, bind };
}
