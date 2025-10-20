import { ChatSession } from "@/domain/model/ChatSession";
import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

export class CreateSessionUseCase {
  constructor(private repo: ChatRepositoryPort) {}

  // Client generates ID → minimal latency; backend is source of truth.
  async execute(clientGeneratedId: string, initialTitle = "New Chat"): Promise<ChatSession> {
    return this.repo.create(clientGeneratedId, initialTitle);
  }
}
