import { ChatSession } from "@/domain/model/ChatSession";
import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

export class ListSessionsUseCase {
  constructor(private repo: ChatRepositoryPort) {}
  execute(): Promise<Pick<ChatSession, "id" | "title" | "lastMessageAt">[]> {
    return this.repo.list();
  }
}
