import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

export class DeleteSessionUseCase {
  constructor(private repo: ChatRepositoryPort) {}
  execute(sessionId: string): Promise<void> {
    return this.repo.delete(sessionId);
  }
}
