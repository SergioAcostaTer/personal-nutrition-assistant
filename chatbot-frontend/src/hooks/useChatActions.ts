"use client";

import { useChatStore } from "@/application/store/useChatStore";

/**
 * A reusable hook that sends a message (user + assistant) to the chat API
 * and updates Zustand store.
 */
export function useChatActions() {
  const { addMessage } = useChatStore();

  /**
   * Send a message to the API and handle the response.
   */
  const sendMessage = async (chatId: string, text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(chatId, { role: "user", content: text });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (data.reply) {
        addMessage(chatId, { role: "assistant", content: data.reply });
      } else if (data.error) {
        addMessage(chatId, {
          role: "assistant",
          content: "⚠️ Server error: " + data.error,
        });
      }
    } catch (err) {
      console.error("Chat send error:", err);
      addMessage(chatId, {
        role: "assistant",
        content: "⚠️ Failed to connect to server.",
      });
    }
  };

  return { sendMessage };
}
