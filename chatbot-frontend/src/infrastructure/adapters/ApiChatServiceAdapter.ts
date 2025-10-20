import { ChatServicePort } from "@/domain/ports/ChatServicePort";
import { HttpClient } from "@/infrastructure/http/HttpClient";
import { readSSE } from "@/infrastructure/sse/SseReader";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

export class ApiChatServiceAdapter implements ChatServicePort {
  constructor(private http = new HttpClient()) {}

  async *sendMessageStream(sessionId: string, userText: string): AsyncGenerator<string> {
    const res = await fetch(`${BASE}/chat/stream`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: userText }),
    });
    if (!res.ok || !res.body) throw new Error("Stream failed");
    yield* readSSE(res.body);
  }

  async generateTitle(sessionId: string, userText: string): Promise<string> {
    const { title } = await this.http.post<{ title: string }>("/chat/title", { sessionId, userText });
    return title || "New Chat";
  }
}
