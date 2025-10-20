import { CreateSessionUseCase } from "@/application/usecases/CreateSessionUseCase";
import { DeleteSessionUseCase } from "@/application/usecases/DeleteSessionUseCase";
import { ListSessionsUseCase } from "@/application/usecases/ListSessionsUseCase";
import { OpenSessionUseCase } from "@/application/usecases/OpenSessionUseCase";
import { RenameSessionUseCase } from "@/application/usecases/RenameSessionUseCase";
import { SendMessageUseCase } from "@/application/usecases/SendMessageUseCase";

import { ApiChatRepositoryAdapter } from "@/infrastructure/adapters/ApiChatRepositoryAdapter";
import { ApiChatServiceAdapter } from "@/infrastructure/adapters/ApiChatServiceAdapter";
import { MockChatRepositoryAdapter } from "@/infrastructure/adapters/MockChatRepositoryAdapter";
import { MockChatServiceAdapter } from "@/infrastructure/adapters/MockChatServiceAdapter";

export class Container {
  chatRepo;
  chatSvc;

  createSession;
  listSessions;
  openSession;
  sendMessage;
  renameSession;
  deleteSession;

  constructor() {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

    this.chatRepo = useMock
      ? new MockChatRepositoryAdapter()
      : new ApiChatRepositoryAdapter();

    this.chatSvc = useMock
      ? new MockChatServiceAdapter()
      : new ApiChatServiceAdapter();

    // Use cases
    this.createSession = new CreateSessionUseCase(this.chatRepo);
    this.listSessions = new ListSessionsUseCase(this.chatRepo);
    this.openSession = new OpenSessionUseCase(this.chatRepo);
    this.renameSession = new RenameSessionUseCase(this.chatRepo);
    this.deleteSession = new DeleteSessionUseCase(this.chatRepo);
    this.sendMessage = new SendMessageUseCase(this.chatSvc);
  }
}

export const container = new Container();
