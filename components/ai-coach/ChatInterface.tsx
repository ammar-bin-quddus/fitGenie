"use client";

import { useState } from "react";

import { ChatInput } from "@/components/ai-coach/ChatInput";
import { ChatMessage } from "@/components/ai-coach/ChatMessage";
import { SuggestedPrompts } from "@/components/ai-coach/SuggestedPrompts";
import { TypingIndicator } from "@/components/ai-coach/TypingIndicator";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";

export function ChatInterface() {
  const { messages, appendMessage, clear } = useChatStore();
  const [loading, setLoading] = useState(false);

  const send = async (content: string) => {
    appendMessage({ role: "user", content });
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content }],
        }),
      });

      const text = await response.text();
      appendMessage({ role: "assistant", content: text });
    } catch {
      appendMessage({
        role: "assistant",
        content: "I hit an issue reaching the AI service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid h-full gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">AI Coach</h2>
          <p className="text-sm text-slate-400">
            Ask questions about training, nutrition, recovery, and consistency.
          </p>
        </div>
        <Button variant="outline" onClick={clear}>
          Clear chat
        </Button>
      </div>
      <SuggestedPrompts onSelect={send} />
      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/40 p-4 h-72">
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} {...message} />
        ))}
        {loading ? <TypingIndicator /> : null}
      </div>
      <ChatInput onSend={send} disabled={loading} />
    </div>
  );
}
