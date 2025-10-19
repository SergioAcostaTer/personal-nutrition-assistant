import { useEffect } from "react";

type Shortcut = string[];

export const useShortcut = (shortcut: Shortcut | undefined, callback: () => void) => {
    useEffect(() => {
        if (!shortcut || shortcut.length === 0) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const keys = shortcut.map((key) => key.toLowerCase());
            const isMatch = keys.every((key) => {
                if (key === "ctrl") return e.ctrlKey;
                if (key === "shift") return e.shiftKey;
                if (key === "alt") return e.altKey;
                return e.key.toLowerCase() === key;
            });

            if (isMatch) {
                e.preventDefault();
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcut, callback]);
};
