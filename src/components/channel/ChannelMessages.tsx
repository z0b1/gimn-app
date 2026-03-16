"use client";

import { useState } from "react";
import { createChannelMessage } from "@/lib/actions/channel-messages";
import { Loader2, Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
};

export function ChannelMessages({
  channelId,
  initialMessages,
}: {
  channelId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPending(true);
    try {
      const result = await createChannelMessage(channelId, content);
      setMessages((prev) => [
        {
          id: result.id,
          content: result.content,
          createdAt: result.createdAt.toString(),
          user: {
            name: result.user.name,
            email: result.user.email,
          },
        },
        ...prev,
      ]);
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Greška pri slanju poruke.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Pošalji poruku u kanal..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={pending || !content.trim()}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Pošalji
        </button>
      </form>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Još uvek nema poruka.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {message.user.name || "Bez imena"}
                </span>
                <span>{new Date(message.createdAt).toLocaleString("sr-RS")}</span>
              </div>
              <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
