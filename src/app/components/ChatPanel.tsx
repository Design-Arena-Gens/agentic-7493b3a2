"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { Property } from "../data/properties";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type ChatPanelProps = {
  selectedProperty?: Property;
};

export function ChatPanel({ selectedProperty }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedProperty) return;

    setMessages((prev) => {
      const alreadySummarized = prev.some((message) =>
        message.role === "assistant" && message.content.includes(selectedProperty.title)
      );
      if (alreadySummarized) return prev;

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          createdAt: Date.now(),
          content: `Now focusing on ${selectedProperty.title} at ${selectedProperty.address}. Ask me anything about price, comps, neighborhood vibe, school ratings, or schedule a tour.`
        }
      ];
    });
  }, [selectedProperty]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        history: messages.slice(-6).map(({ role, content }) => ({ role, content })),
        property: selectedProperty
      })
    });

    if (!response.ok) {
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          createdAt: Date.now(),
          content: "I'm having trouble reaching the AI services right now. Please try again shortly."
        }
      ]);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      setIsStreaming(false);
      return;
    }

    const decoder = new TextDecoder();
    let assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now()
    };

    setMessages((prev) => [...prev, assistantMessage]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistantMessage = (function updateMessage(prevMessage) {
        const chunk = decoder.decode(value, { stream: true });
        const updated = { ...prevMessage, content: prevMessage.content + chunk };
        setMessages((prev) => prev.map((message) => (message.id === prevMessage.id ? updated : message)));
        return updated;
      })(assistantMessage);
    }

    setIsStreaming(false);
  };

  return (
    <div className="card flex h-full flex-col">
      <header className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">AI Copilot</h2>
        <p className="text-sm text-slate-300/80">Conversational intelligence powered by GPT for pricing guidance, insights, and itinerary planning.</p>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Ask about walkability, commute times, value-add ideas, short-term rental rules, or request a guided tour. Select a property to tailor the insights.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "assistant" ? "mr-8" : "ml-8 text-right"}
              >
                <span className="block text-xs uppercase tracking-wide text-slate-400">
                  {message.role === "assistant" ? "Atlas AI" : "You"}
                </span>
                <div
                  className={`mt-1 inline-block max-w-full whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${message.role === "assistant" ? "bg-white/10 text-slate-100" : "bg-brand-500 text-white"}`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-950/60 px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={selectedProperty ? `Ask about ${selectedProperty.title} or compare it to other listings...` : "Select a property or ask about the San Francisco market..."}
              className="min-h-[3rem] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/40 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/50"
              rows={2}
            />
            <button
              type="submit"
              disabled={isStreaming || input.trim().length === 0}
              className="button-primary min-w-[92px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStreaming ? "Thinking" : "Send"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            GPT responses take neighborhood stats, market velocity, and city planning data into account for nuanced guidance.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel;
