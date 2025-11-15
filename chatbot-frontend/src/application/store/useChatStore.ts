// ============================================
// FILE: src/application/store/useChatStore.ts
// ============================================
"use client";

import { container } from "@/composition/container";
import { ChatSession } from "@/domain/model/ChatSession";
import { create } from "zustand";

type SidebarItem = { id: string; title: string; lastMessageAt?: string };

interface State {
    sidebar: SidebarItem[];
    sessions: Record<string, ChatSession>;
    loading: Record<string, boolean>;
    errors: Record<string, string>;

    bootstrap(): Promise<void>;
    loadSession(id: string): Promise<void>;
    createSession(firstMessage?: string): Promise<string>;
    sendMessage(sessionId: string, text: string): Promise<void>;
    renameSession(id: string, title: string): Promise<void>;
    deleteSession(id: string): Promise<void>;
}

export const useChatStore = create<State>((set, get) => ({
    sidebar: [],
    sessions: {},
    loading: {},
    errors: {},

    async bootstrap() {
        const list = await container.listSessions.execute();
        set({ sidebar: list });
    },

    async loadSession(id: string) {
        const existing = get().sessions[id];
        if (existing) return; // Already loaded

        set((s) => ({
            loading: { ...s.loading, [id]: true },
            errors: { ...s.errors, [id]: "" },
        }));

        try {
            const chat = await container.openSession.execute(id);
            set((s) => ({
                sessions: { ...s.sessions, [id]: chat },
                loading: { ...s.loading, [id]: false },
            }));
        } catch (e) {
            console.error("Failed to load session:", e);
            set((s) => ({
                loading: { ...s.loading, [id]: false },
                errors: { ...s.errors, [id]: "Failed to load chat" },
            }));
        }
    },

    async createSession(firstMessage?: string) {
        const id = crypto.randomUUID();

        // Create placeholder immediately
        const placeholder = {
            id,
            title: "New Chat",
            messages: [],
            lastMessageAt: new Date().toISOString()
        };

        set(s => ({
            sessions: { ...s.sessions, [id]: placeholder },
            sidebar: [
                { id, title: placeholder.title, lastMessageAt: placeholder.lastMessageAt },
                ...s.sidebar
            ],
            loading: { ...s.loading, [id]: true },
        }));

        try {
            const created = await container.createSession.execute(id, "New Chat");
            set(s => ({
                sessions: { ...s.sessions, [id]: created },
                loading: { ...s.loading, [id]: false },
            }));

            // Send first message if provided
            if (firstMessage?.trim()) {
                await get().sendMessage(id, firstMessage.trim());
            }
        } catch (e) {
            console.error("Failed to create session:", e);
            set(s => ({
                loading: { ...s.loading, [id]: false },
                errors: { ...s.errors, [id]: "Failed to create chat" },
            }));
        }

        return id;
    },

    async sendMessage(sessionId: string, text: string) {
        const userText = text.trim();
        if (!userText) return;

        await container.sendMessage.execute({
            sessionId,
            userText,
            onUserAccepted: (user) => set(s => {
                const c = s.sessions[sessionId] ?? { id: sessionId, title: "New Chat", messages: [] };
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, user] } } };
            }),
            onAssistantDraftCreated: (_draftId, draft) => set(s => {
                const c = s.sessions[sessionId]!;
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, draft] } } };
            }),
            onAssistantDelta: (_draftId, delta) => set(s => {
                const c = s.sessions[sessionId]!;
                const msgs = c.messages.slice();
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: msgs[msgs.length - 1].content + delta };
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: msgs } } };
            }),
            onAssistantDone: async () => {
                const sess = get().sessions[sessionId];
                const last = sess.messages.at(-1)?.createdAt ?? new Date().toISOString();
                set(s => ({
                    sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, lastMessageAt: last } : it)
                }));
            },
            maybeGenerateTitle: async (firstUserText) => {
                const sess = get().sessions[sessionId];
                if (!sess.title || sess.title === "New Chat") {
                    const title = await container.chatSvc.generateTitle(sessionId, firstUserText);
                    await container.renameSession.execute(sessionId, title);
                    set(s => ({
                        sessions: { ...s.sessions, [sessionId]: { ...s.sessions[sessionId]!, title } },
                        sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, title } : it),
                    }));
                }
            },
            batchingMs: 16,
        });
    },

    async renameSession(id, title) {
        await container.renameSession.execute(id, title);
        set(s => ({
            sessions: { ...s.sessions, [id]: { ...s.sessions[id], title } },
            sidebar: s.sidebar.map(it => (it.id === id ? { ...it, title } : it)),
        }));
    },

    async deleteSession(id) {
        await container.deleteSession.execute(id);
        set(s => ({
            sidebar: s.sidebar.filter(it => it.id !== id),
            sessions: Object.fromEntries(Object.entries(s.sessions).filter(([k]) => k !== id)),
        }));
    },
}));