import { create } from "zustand";

import type { ChatMessage } from "@/types";

type ChatState = {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  clear: () => void;
};

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to FitGenie. Ask for a workout split, a meal strategy, recovery tips, or help staying consistent.",
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [initialMessage],
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clear: () => set({ messages: [initialMessage] }),
}));
