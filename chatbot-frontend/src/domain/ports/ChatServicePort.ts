// LLM/streaming port – pure domain contract
export interface ChatServicePort {
  // Stream assistant tokens; backend persists messages.
  sendMessageStream(sessionId: string, userText: string): AsyncGenerator<string>;

  // Ask backend to generate a short title and persist it; returns final title.
  generateTitle(sessionId: string, userText: string): Promise<string>;
}
