"use client";

import { container } from "@/composition/container";
import { ChatSession } from "@/domain/model/ChatSession";
import { create } from "zustand";

type SidebarItem = {
    id: string;
    title: string;
    lastMessageAt?: string;
};

interface State {
    sidebar: SidebarItem[];
    sessions: Record<string, ChatSession>;
    loading: Record<string, boolean>;
    errors: Record<string, string>;
    bootstrap(): Promise<void>;
    loadSession(id: string): void;
    renameSession(id: string, title: string): void;
    deleteSession(id: string): void;
}

export const useChatStore = create<State>((set, get) => ({
    sidebar: [],
    sessions: {},
    loading: {},
    errors: {},

    async bootstrap() {
        try {
            const list = await container.listSessions.execute();
            set({ sidebar: list });
        } catch {
            set({ sidebar: [] });
        }
    },

    loadSession(id: string) {
        const { sessions, loading } = get();
        if (sessions[id] || loading[id]) return;

        set((s) => ({
            loading: { ...s.loading, [id]: true },
            errors: { ...s.errors, [id]: "" },
        }));

        container.openSession
            .execute(id)
            .then((chat) => {
                set((s) => ({
                    sessions: { ...s.sessions, [id]: chat },
                    loading: { ...s.loading, [id]: false },
                }));
            })
            .catch(() => {
                set((s) => ({
                    loading: { ...s.loading, [id]: false },
                    errors: { ...s.errors, [id]: "Could not load chat" },
                }));
            });
    },

    renameSession(id, title) {
        set((s) => ({
            sessions: {
                ...s.sessions,
                [id]: { ...s.sessions[id], title },
            },
            sidebar: s.sidebar.map((it) =>
                it.id === id ? { ...it, title } : it
            ),
        }));

        container.renameSession.execute(id, title).catch(() => { });
    },

    deleteSession(id) {
        set((s) => ({
            sidebar: s.sidebar.filter((it) => it.id !== id),
            sessions: Object.fromEntries(
                Object.entries(s.sessions).filter(([k]) => k !== id)
            ),
        }));

        container.deleteSession.execute(id).catch(() => { });
    },
}));
