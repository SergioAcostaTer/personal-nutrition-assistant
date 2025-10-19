import { create } from "zustand";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  chats: Record<string, ChatMessage[]>;
  addMessage: (chatId: string, msg: ChatMessage) => void;
  clearChat: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: {},
  addMessage: (chatId, msg) =>
    set((state) => {
      const existing = state.chats[chatId] || [];
      return { chats: { ...state.chats, [chatId]: [...existing, msg] } };
    }),
  clearChat: (chatId) =>
    set((state) => {
      const updated = { ...state.chats };
      updated[chatId] = [];
      return { chats: updated };
    }),
}));
