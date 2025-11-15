// ============================================
// FILE: src/application/store/useChatStore.ts
// OPTIMIZED: Fast, non-blocking, graceful error handling
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
    loadSession(id: string): void;
    createSession(firstMessage?: string): Promise<string>;
    sendMessage(sessionId: string, text: string): void;
    renameSession(id: string, title: string): void;
    deleteSession(id: string): void;
}

export const useChatStore = create<State>((set, get) => ({
    sidebar: [],
    sessions: {},
    loading: {},
    errors: {},

    // Non-blocking bootstrap
    async bootstrap() {
        try {
            const list = await container.listSessions.execute();
            set({ sidebar: list });
        } catch (err) {
            console.warn("Bootstrap failed:", err);
            set({ sidebar: [] });
        }
    },

    // Optimistic loading - never blocks UI
    loadSession(id: string) {
        const existing = get().sessions[id];
        if (existing) return;

        // Set loading state immediately
        set(s => ({ loading: { ...s.loading, [id]: true } }));

        // Load in background
        container.openSession.execute(id)
            .then(chat => {
                set(s => ({
                    sessions: { ...s.sessions, [id]: chat },
                    loading: { ...s.loading, [id]: false },
                    errors: { ...s.errors, [id]: "" },
                }));
            })
            .catch(err => {
                console.warn(`Failed to load session ${id}:`, err);
                set(s => ({
                    loading: { ...s.loading, [id]: false },
                    errors: { ...s.errors, [id]: "Could not load chat" },
                }));
            });
    },

    // Optimistic creation - UI updates instantly
    async createSession(firstMessage?: string) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        // Create placeholder immediately for instant UI feedback
        const placeholder: ChatSession = {
            id,
            title: "New Chat",
            messages: [],
            lastMessageAt: now
        };

        set(s => ({
            sessions: { ...s.sessions, [id]: placeholder },
            sidebar: [{ id, title: placeholder.title, lastMessageAt: now }, ...s.sidebar],
        }));

        // Persist in background
        container.createSession.execute(id, "New Chat")
            .then(created => {
                set(s => ({ sessions: { ...s.sessions, [id]: created } }));
            })
            .catch(err => {
                console.warn("Session creation failed:", err);
                // Keep the optimistic session - user can still interact
            });

        // Send first message if provided (non-blocking)
        if (firstMessage?.trim()) {
            get().sendMessage(id, firstMessage.trim());
        }

        return id;
    },

    // Non-blocking message send with optimistic updates
    sendMessage(sessionId: string, text: string) {
        const userText = text.trim();
        if (!userText) return;

        // Execute in background - UI never blocks
        container.sendMessage.execute({
            sessionId,
            userText,
            onUserAccepted: (user) => {
                set(s => {
                    const c = s.sessions[sessionId] ?? { id: sessionId, title: "New Chat", messages: [] };
                    return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, user] } } };
                });
            },
            onAssistantDraftCreated: (_draftId, draft) => {
                set(s => {
                    const c = s.sessions[sessionId];
                    if (!c) return s;
                    return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, draft] } } };
                });
            },
            onAssistantDelta: (_draftId, delta) => {
                set(s => {
                    const c = s.sessions[sessionId];
                    if (!c) return s;
                    const msgs = c.messages.slice();
                    const lastIdx = msgs.length - 1;
                    if (lastIdx >= 0) {
                        msgs[lastIdx] = { ...msgs[lastIdx], content: msgs[lastIdx].content + delta };
                    }
                    return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: msgs } } };
                });
            },
            onAssistantDone: () => {
                const sess = get().sessions[sessionId];
                if (!sess) return;
                const last = sess.messages.at(-1)?.createdAt ?? new Date().toISOString();
                set(s => ({
                    sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, lastMessageAt: last } : it)
                }));
            },
            maybeGenerateTitle: async (firstUserText) => {
                try {
                    const sess = get().sessions[sessionId];
                    if (!sess || (sess.title && sess.title !== "New Chat")) return;

                    const title = await container.chatSvc.generateTitle(sessionId, firstUserText);
                    await container.renameSession.execute(sessionId, title);

                    set(s => ({
                        sessions: { ...s.sessions, [sessionId]: { ...s.sessions[sessionId]!, title } },
                        sidebar: s.sidebar.map(it => it.id === sessionId ? { ...it, title } : it),
                    }));
                } catch (err) {
                    console.warn("Title generation failed:", err);
                    // Silent failure - not critical
                }
            },
            batchingMs: 16,
        }).catch(err => {
            console.warn("Message send failed:", err);
            // Add error message to chat
            set(s => {
                const c = s.sessions[sessionId];
                if (!c) return s;
                const errorMsg = {
                    id: crypto.randomUUID(),
                    role: "assistant" as const,
                    content: "⚠️ Failed to send message. Please try again.",
                    createdAt: new Date().toISOString(),
                };
                return { sessions: { ...s.sessions, [sessionId]: { ...c, messages: [...c.messages, errorMsg] } } };
            });
        });
    },

    // Optimistic rename
    renameSession(id, title) {
        // Update UI immediately
        set(s => ({
            sessions: { ...s.sessions, [id]: { ...s.sessions[id], title } },
            sidebar: s.sidebar.map(it => (it.id === id ? { ...it, title } : it)),
        }));

        // Persist in background
        container.renameSession.execute(id, title)
            .catch(err => console.warn("Rename failed:", err));
    },

    // Optimistic delete
    deleteSession(id) {
        // Remove from UI immediately
        set(s => ({
            sidebar: s.sidebar.filter(it => it.id !== id),
            sessions: Object.fromEntries(Object.entries(s.sessions).filter(([k]) => k !== id)),
        }));

        // Delete from backend in background
        container.deleteSession.execute(id)
            .catch(err => console.warn("Delete failed:", err));
    },
}));