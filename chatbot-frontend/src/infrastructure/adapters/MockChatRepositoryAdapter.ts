import { ChatSession } from "@/domain/model/ChatSession";
import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

/**
 * Mock repository that persists sessions in localStorage.
 * Perfect for dev or offline testing with NEXT_PUBLIC_USE_MOCK=true.
 */
export class MockChatRepositoryAdapter implements ChatRepositoryPort {
    private store = new Map<string, ChatSession>();
    private storageKey = "mock_chat_sessions_v1";

    constructor(initial?: ChatSession[]) {
        if (typeof window !== "undefined") {
            this.loadFromStorage();
        }
        if (initial?.length) {
            for (const s of initial) this.store.set(s.id, s);
            this.saveToStorage();
        }
    }

    // Utility: simulate network delay
    private delay<T>(data: T, ms = 100): Promise<T> {
        return new Promise((res) => setTimeout(() => res(data), ms));
    }

    private loadFromStorage() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed: ChatSession[] = JSON.parse(raw);
                this.store = new Map(parsed.map((s) => [s.id, s]));
            }
        } catch (err) {
            console.warn("Failed to load mock sessions:", err);
        }
    }

    private saveToStorage() {
        try {
            const all = [...this.store.values()];
            localStorage.setItem(this.storageKey, JSON.stringify(all));
        } catch (err) {
            console.warn("Failed to save mock sessions:", err);
        }
    }

    private updateSession(id: string, mutator: (s: ChatSession) => void) {
        const sess = this.store.get(id);
        if (!sess) return;
        mutator(sess);
        sess.lastMessageAt = new Date().toISOString();
        this.store.set(id, sess);
        this.saveToStorage();
    }

    async list(): Promise<Pick<ChatSession, "id" | "title" | "lastMessageAt">[]> {
        const sessions = [...this.store.values()].map((s) => ({
            id: s.id,
            title: s.title,
            lastMessageAt: s.lastMessageAt,
        }));
        sessions.sort(
            (a, b) =>
                new Date(b.lastMessageAt || "").getTime() -
                new Date(a.lastMessageAt || "").getTime()
        );
        return this.delay(sessions);
    }

    async get(sessionId: string): Promise<ChatSession> {
        const chat = this.store.get(sessionId);
        if (!chat) throw new Error("Session not found");
        return this.delay(structuredClone(chat));
    }

    async create(sessionId: string, title: string): Promise<ChatSession> {
        const newSession: ChatSession = {
            id: sessionId,
            title,
            messages: [],
            lastMessageAt: new Date().toISOString(),
        };
        this.store.set(sessionId, newSession);
        this.saveToStorage();
        return this.delay(newSession);
    }

    async rename(sessionId: string, title: string): Promise<void> {
        this.updateSession(sessionId, (s) => (s.title = title));
        return this.delay(undefined);
    }

    async delete(sessionId: string): Promise<void> {
        this.store.delete(sessionId);
        this.saveToStorage();
        return this.delay(undefined);
    }
}
