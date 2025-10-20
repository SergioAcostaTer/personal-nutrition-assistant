import { ChatSession } from "@/domain/model/ChatSession";


export interface ChatRepositoryPort {
  list(): Promise<Pick<ChatSession, "id" | "title" | "lastMessageAt">[]>;
  get(sessionId: string): Promise<ChatSession>;
  create(sessionId: string, title: string): Promise<ChatSession>;
  rename(sessionId: string, title: string): Promise<void>;
  delete(sessionId: string): Promise<void>;
}
