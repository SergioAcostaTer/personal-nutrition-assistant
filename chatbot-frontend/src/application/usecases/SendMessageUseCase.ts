import { ChatMessage } from "@/domain/model/ChatMessage";
import { ChatServicePort } from "@/domain/ports/ChatServicePort";

/**
 * Streams assistant tokens with micro-batching to reduce UI churn.
 * Consumers pass callbacks to integrate with any state system (Zustand here).
 */
export class SendMessageUseCase {
  constructor(private chat: ChatServicePort) {}

  async execute(params: {
    sessionId: string;
    userText: string;
    onUserAccepted: (userMsg: ChatMessage) => void;
    onAssistantDraftCreated: (draftId: string, draftMsg: ChatMessage) => void;
    onAssistantDelta: (draftId: string, delta: string) => void;
    onAssistantDone?: (draftId: string) => void;
    maybeGenerateTitle?: (userText: string) => Promise<void>;
    batchingMs?: number; // for micro-batching
  }) {
    const {
      sessionId,
      userText,
      onUserAccepted,
      onAssistantDraftCreated,
      onAssistantDelta,
      onAssistantDone,
      maybeGenerateTitle,
      batchingMs = 16,
    } = params;

    const now = new Date().toISOString();
    const user: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
      createdAt: now,
    };
    onUserAccepted(user);

    const draftId = crypto.randomUUID();
    const draft: ChatMessage = {
      id: draftId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    onAssistantDraftCreated(draftId, draft);

    // micro-batch tokens to minimize setState thrash
    let buffer = "";
    let timer: number | undefined;

    const flush = () => {
      if (!buffer) return;
      onAssistantDelta(draftId, buffer);
      buffer = "";
    };

    try {
      for await (const token of this.chat.sendMessageStream(sessionId, userText)) {
        buffer += token;
        if (timer === undefined) {
          timer = (setTimeout(() => {
            flush();
            timer = undefined;
          }, batchingMs) as unknown) as number;
        }
      }
      flush();
      onAssistantDone?.(draftId);

      if (maybeGenerateTitle) await maybeGenerateTitle(userText);
    } catch (e) {
      buffer += " ⚠️ Connection error";
      flush();
      onAssistantDone?.(draftId);
    }
  }
}
