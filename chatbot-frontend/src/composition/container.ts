import { CreateSessionUseCase } from "@/application/usecases/CreateSessionUseCase";
import { DeleteSessionUseCase } from "@/application/usecases/DeleteSessionUseCase";
import { ListSessionsUseCase } from "@/application/usecases/ListSessionsUseCase";
import { OpenSessionUseCase } from "@/application/usecases/OpenSessionUseCase";
import { RenameSessionUseCase } from "@/application/usecases/RenameSessionUseCase";
import { SendMessageUseCase } from "@/application/usecases/SendMessageUseCase";
import { ApiChatRepositoryAdapter } from "@/infrastructure/adapters/ApiChatRepositoryAdapter";
import { ApiChatServiceAdapter } from "@/infrastructure/adapters/ApiChatServiceAdapter";

export class Container {
  // Ports
  chatRepo = new ApiChatRepositoryAdapter();
  chatSvc = new ApiChatServiceAdapter();

  // Use cases
  createSession = new CreateSessionUseCase(this.chatRepo);
  listSessions = new ListSessionsUseCase(this.chatRepo);
  openSession = new OpenSessionUseCase(this.chatRepo);
  sendMessage = new SendMessageUseCase(this.chatSvc);
  renameSession = new RenameSessionUseCase(this.chatRepo);
  deleteSession = new DeleteSessionUseCase(this.chatRepo);
}

export const container = new Container();
