// src/hooks/useChatSession.ts
"use client";

import { useChatStore } from "@/application/store/useChatStore";
import { useEffect, useMemo } from "react";

export function useChatSession(chatId?: string) {
    const sessions = useChatStore((s) => s.sessions);
    const loading = useChatStore((s) => s.loading);
    const errors = useChatStore((s) => s.errors);
    const loadSession = useChatStore((s) => s.loadSession);

    useEffect(() => {
        if (!chatId) return;
        if (!sessions[chatId] && !loading[chatId]) {
            loadSession(chatId);
        }
    }, [chatId, sessions, loading, loadSession]);

    return useMemo(() => {
        if (!chatId) {
            return {
                chat: undefined,
                isLoading: false,
                error: undefined,
            };
        }

        return {
            chat: sessions[chatId],
            isLoading: loading[chatId] ?? false,
            error: errors[chatId],
        };
    }, [chatId, sessions, loading, errors]);
}
