"use client";

import { container } from "@/composition/container";
import { ChatSession } from "@/domain/model/ChatSession";
import { create } from "zustand";

type SidebarItem = { id: string; title: string; lastMessageAt?: string };

interface State {
    sidebar: SidebarItem[];
    sessions: Record<string, ChatSession>;
    activeId?: string;
    loading: Record<string, boolean>; // Track loading per session
    errors: Record<string, string>; // Track errors per session

    bootstrap(): Promise<void>;
    open(id: string): Promise<void>;
    newChat(firstMessage?: string): Promise<string>;
    send(text: string): Promise<void>;
    rename(id: string, title: string): Promise<void>;
    remove(id: string): Promise<void>;
}

export const useChatStore = create<State>((set, get) => ({
    sidebar: [],
    sessions: {},
    activeId: undefined,
    loading: {},
    errors: {},

    async bootstrap() {
        const list = await container.listSessions.execute();
        set({ sidebar: list });
    },

    async open(id: string) {
        const existing = get().sessions[id];

        // Instantly set active — navigation happens immediately
        set({ activeId: id });

        // If already loaded, we're done
        if (existing) {
            return;
        }

        // Set loading state for this specific session
        set((s) => ({
            loading: { ...s.loading, [id]: true },
            errors: { ...s.errors, [id]: "" },
        }));

        // Fetch messages asynchronously in the background
        try {
            const chat = await container.openSession.execute(id);
            set((s) => ({
                sessions: { ...s.sessions, [id]: chat },
                loading: { ...s.loading, [id]: false },
            }));
        } catch (e) {
            console.error("Failed to open chat:", e);
            set((s) => ({
                loading: { ...s.loading, [id]: false },
                errors: { ...s.errors, [id]: "Failed to load chat" },
            }));
        }
    },

    async newChat(firstMessage?: string) {
        const id = crypto.randomUUID();

        // Instantly create placeholder and switch to it
        const placeholder = { id, title: "New Chat", messages: [], lastMessageAt: new Date().toISOString() };
        set(s => ({
            sessions: { ...s.sessions, [id]: placeholder },
            sidebar: [{ id, title: placeholder.title, lastMessageAt: placeholder.lastMessageAt }, ...s.sidebar],
            activeId: id,
            loading: { ...s.loading, [id]: true },
        }));

        // Create on backend in background
        try {
            const created = await container.createSession.execute(id, "New Chat");
            set(s => ({
                sessions: { ...s.sessions, [id]: created },
                loading: { ...s.loading, [id]: false },
            }));

            if (firstMessage?.trim()) {
                await get().send(firstMessage.trim());
            }
        } catch (e) {
            console.error("Failed to create chat:", e);
            set(s => ({
                loading: { ...s.loading, [id]: false },
                errors: { ...s.errors, [id]: "Failed to create chat" },
            }));
        }

        return id;
    },

    async send(text: string) {
        const sessionId = get().activeId;
        if (!sessionId) throw new Error("No active session");
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

    async rename(id, title) {
        await container.renameSession.execute(id, title);
        set(s => ({
            sessions: { ...s.sessions, [id]: { ...s.sessions[id], title } },
            sidebar: s.sidebar.map(it => (it.id === id ? { ...it, title } : it)),
        }));
    },

    async remove(id) {
        await container.deleteSession.execute(id);
        set(s => ({
            sidebar: s.sidebar.filter(it => it.id !== id),
            sessions: Object.fromEntries(Object.entries(s.sessions).filter(([k]) => k !== id)),
            activeId: s.activeId === id ? undefined : s.activeId,
        }));
    },
}));