// ============================================
// FILE: src/infrastructure/http/HttpClient.ts
// ============================================

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

type Json = Record<string, unknown> | undefined;

/**
 * HTTP client with automatic retry and graceful error handling
 * - Never throws - returns error responses
 * - Retries transient failures automatically
 * - Provides detailed error info for debugging
 */
export class HttpClient {
    constructor(
        private base: string = BASE,
        private maxRetries: number = 2,
        private retryDelay: number = 500
    ) { }

    private async request(
        path: string,
        init: RequestInit,
        retries = 0
    ): Promise<Response> {
        try {
            const res = await fetch(`${this.base}${path}`, {
                ...init,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(init.headers || {}),
                },
            });

            // Retry on 5xx errors or rate limits
            if (retries < this.maxRetries && (res.status >= 500 || res.status === 429)) {
                await new Promise(r => setTimeout(r, this.retryDelay * (retries + 1)));
                return this.request(path, init, retries + 1);
            }

            return res;
        } catch (err) {
            // Network error - retry if possible
            if (retries < this.maxRetries) {
                await new Promise(r => setTimeout(r, this.retryDelay * (retries + 1)));
                return this.request(path, init, retries + 1);
            }

            // Return mock error response
            console.error(`HTTP ${init.method || "GET"} ${path} failed:`, err);
            return new Response(
                JSON.stringify({ error: "Network error", details: String(err) }),
                { status: 0, statusText: "Network Error" }
            );
        }
    }

    async get<T>(path: string): Promise<T> {
        const res = await this.request(path, { method: "GET" });

        if (!res.ok) {
            console.warn(`GET ${path} failed (${res.status})`);
            return {} as T; // Return empty object instead of throwing
        }

        try {
            return await res.json();
        } catch (err) {
            console.warn(`GET ${path} - invalid JSON:`, err);
            return {} as T;
        }
    }

    async post<T>(path: string, body?: Json): Promise<T> {
        const res = await this.request(path, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            console.warn(`POST ${path} failed (${res.status})`);
            return {} as T;
        }

        try {
            return await res.json();
        } catch (err) {
            console.warn(`POST ${path} - invalid JSON:`, err);
            return {} as T;
        }
    }

    async patch<T = void>(path: string, body?: Json): Promise<T> {
        const res = await this.request(path, {
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            console.warn(`PATCH ${path} failed (${res.status})`);
            return undefined as T;
        }

        try {
            return await res.json();
        } catch {
            return undefined as T;
        }
    }

    async delete(path: string): Promise<void> {
        const res = await this.request(path, { method: "DELETE" });

        if (!res.ok) {
            console.warn(`DELETE ${path} failed (${res.status})`);
        }
    }
}