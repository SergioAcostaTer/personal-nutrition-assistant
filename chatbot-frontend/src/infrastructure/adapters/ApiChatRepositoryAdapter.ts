import { ChatSession } from "@/domain/model/ChatSession";
import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";
import { HttpClient } from "@/infrastructure/http/HttpClient";

export class ApiChatRepositoryAdapter implements ChatRepositoryPort {
  constructor(private http = new HttpClient()) {}

  list(): Promise<Pick<ChatSession, "id" | "title" | "lastMessageAt">[]> {
    return this.http.get("/sessions");
  }
  get(id: string): Promise<ChatSession> {
    return this.http.get(`/sessions/${id}`);
  }
  create(id: string, title: string): Promise<ChatSession> {
    return this.http.post("/sessions", { id, title });
  }
  rename(id: string, title: string): Promise<void> {
    return this.http.patch(`/sessions/${id}`, { title });
  }
  delete(id: string): Promise<void> {
    return this.http.delete(`/sessions/${id}`);
  }
}
