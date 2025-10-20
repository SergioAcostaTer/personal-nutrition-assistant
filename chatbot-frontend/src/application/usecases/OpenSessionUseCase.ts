import { ChatSession } from "@/domain/model/ChatSession";
import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

export class OpenSessionUseCase {
  constructor(private repo: ChatRepositoryPort) {}
  execute(sessionId: string): Promise<ChatSession> {
    return this.repo.get(sessionId);
  }
}
