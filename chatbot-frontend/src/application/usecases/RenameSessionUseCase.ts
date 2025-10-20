import { ChatRepositoryPort } from "@/domain/ports/ChatRepositoryPort";

export class RenameSessionUseCase {
  constructor(private repo: ChatRepositoryPort) {}
  execute(sessionId: string, title: string): Promise<void> {
    return this.repo.rename(sessionId, title);
  }
}
