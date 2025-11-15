// ============================================
// FILE: src/infrastructure/adapters/ApiChatServiceAdapter.ts
// OPTIMIZED: Resilient streaming with auto-recovery
// ============================================
import { ChatServicePort } from "@/domain/ports/ChatServicePort";
import { HttpClient } from "@/infrastructure/http/HttpClient";
import { readSSE } from "@/infrastructure/sse/SseReader";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export class ApiChatServiceAdapter implements ChatServicePort {
    constructor(private http = new HttpClient()) { }

    async *sendMessageStream(sessionId: string, userText: string): AsyncGenerator<string> {
        let retries = 0;
        const maxRetries = 2;

        while (retries <= maxRetries) {
            try {
                const res = await fetch(`${BASE}/chat/stream`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, message: userText }),
                    signal: AbortSignal.timeout(30000), // 30s timeout
                });

                if (!res.ok) {
                    throw new Error(`Stream failed: ${res.status}`);
                }

                if (!res.body) {
                    throw new Error("No response body");
                }

                // Stream successful - yield all tokens
                yield* readSSE(res.body);
                return; // Success - exit

            } catch (err) {
                console.warn(`Stream attempt ${retries + 1} failed:`, err);

                retries++;

                if (retries > maxRetries) {
                    // Max retries reached - yield error message
                    yield "⚠️ ";
                    yield "Connection ";
                    yield "failed. ";
                    yield "Please ";
                    yield "try ";
                    yield "again.";
                    return;
                }

                // Wait before retry (exponential backoff)
                await new Promise(r => setTimeout(r, 500 * retries));
            }
        }
    }

    async generateTitle(sessionId: string, userText: string): Promise<string> {
        try {
            const { title } = await this.http.post<{ title: string }>("/chat/title", {
                sessionId,
                userText
            });

            return title || this.fallbackTitle(userText);
        } catch (err) {
            console.warn("Title generation failed:", err);
            return this.fallbackTitle(userText);
        }
    }

    private fallbackTitle(userText: string): string {
        const words = userText.split(/\s+/);
        const short = words.slice(0, 5).join(" ");
        return short.charAt(0).toUpperCase() + short.slice(1) + (words.length > 5 ? "…" : "");
    }
}