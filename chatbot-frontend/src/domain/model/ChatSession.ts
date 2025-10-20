import { ChatMessage } from "./ChatMessage";

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessageAt?: string;
}
