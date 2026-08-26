"use client";

import { useState, useRef, useEffect } from "react";
import { models, defaultModel, type AiModel } from "@/lib/ai/models";
import { cn } from "@/lib/utils";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChat({
  initialGreeting = "Zdravo! Ja sam GimnApp AI asistent. Kako ti mogu pomoći danas?",
}: {
  initialGreeting?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialGreeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let msg = "Desila se greška. Molim te pokušaj ponovo.";
        try {
          const err = await res.json();
          if (typeof err?.error === "string") msg = err.error;
          else if (err?.error?.message) msg = err.error.message;
        } catch {
          // ignore parse failure, keep default message
        }
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Asistent nije mogao da učita odgovor.");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (!value) continue;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta || {};
            const content = delta.content || "";
            if (content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + content,
                  };
                }
                return updated;
              });
            }
          } catch {
            // skip parse errors
          }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && !last.content.trim()) {
          updated[updated.length - 1] = {
            ...last,
            content: "Asistent nije vratio odgovor. Pokušaj ponovo ili izaberi drugi model.",
          };
        }
        return updated;
      });
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Desila se greška. Molim te pokušaj ponovo.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const groupedModels = models.reduce<Record<string, AiModel[]>>((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  return (
    <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
      {/* Model selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <button
            onClick={() => setIsModelOpen(!isModelOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Sparkles size={14} className="text-brand-primary dark:text-brand-secondary" />
            <span className="hidden sm:inline">
              {selectedModelData?.name || "Model"}
            </span>
            <span className="sm:hidden">
              {selectedModelData?.provider || "Model"}
            </span>
            <ChevronDown size={14} className={`transition-transform ${isModelOpen ? "rotate-180" : ""}`} />
          </button>

          {isModelOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsModelOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 max-h-[60vh] overflow-y-auto">
                <div className="p-2">
                  {Object.entries(groupedModels).map(([provider, providerModels]) => (
                    <div key={provider}>
                      <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {provider}
                      </div>
                      {providerModels.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m.id);
                            setIsModelOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors",
                            selectedModel === m.id
                              ? "bg-brand-primary/10 text-brand-primary dark:text-brand-secondary font-medium"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          <span>{m.name}</span>
                          {m.free ? (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                              Free
                            </span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                              Paid
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bot size={16} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed",
                msg.role === "user"
                  ? "bg-brand-primary text-white rounded-br-md"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-sm"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napiši poruku..."
          rows={1}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none max-h-32"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            input.trim() && !isLoading
              ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
          )}
        >
          <Send size={18} />
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500 px-2">
        GimnApp AI može da pravi greške. Proveri važne informacije i ne koristi ga
        kao zamenu za stručni savet.
      </p>
    </main>
  );
}
