"use client";

import { useState } from "react";
import {
  addChannelMessageComment,
  createChannelMessage,
  toggleChannelMessageLike,
} from "@/lib/actions/channel-messages";
import { Heart, Loader2, MessageCircle, Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
  }>;
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
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentPending, setCommentPending] = useState<string | null>(null);
  const [likePending, setLikePending] = useState<string | null>(null);

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
          likeCount: 0,
          likedByMe: false,
          comments: [],
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

  const handleToggleLike = async (messageId: string) => {
    setLikePending(messageId);
    try {
      const result = await toggleChannelMessageLike(messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, likeCount: result.likeCount, likedByMe: result.liked } : m
        )
      );
    } catch (error) {
      console.error(error);
      alert("Greška pri reagovanju.");
    } finally {
      setLikePending(null);
    }
  };

  const handleAddComment = async (messageId: string) => {
    const draft = commentDrafts[messageId]?.trim();
    if (!draft) return;
    setCommentPending(messageId);
    try {
      const result = await addChannelMessageComment(messageId, draft);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                comments: [
                  {
                    id: result.id,
                    content: result.content,
                    createdAt: result.createdAt.toString(),
                    user: {
                      name: result.user.name,
                      email: result.user.email,
                    },
                  },
                  ...m.comments,
                ],
              }
            : m
        )
      );
      setCommentDrafts((prev) => ({ ...prev, [messageId]: "" }));
    } catch (error) {
      console.error(error);
      alert("Greška pri dodavanju komentara.");
    } finally {
      setCommentPending(null);
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
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {message.user.name || "Bez imena"}
                </span>
                <span>{new Date(message.createdAt).toLocaleString("sr-RS")}</span>
              </div>
              <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{message.content}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => handleToggleLike(message.id)}
                  disabled={likePending === message.id}
                  className={`inline-flex items-center gap-1 ${message.likedByMe ? "text-rose-500" : "text-slate-500"} hover:text-rose-500 transition-colors`}
                  aria-pressed={message.likedByMe}
                >
                  {likePending === message.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Heart size={14} fill={message.likedByMe ? "currentColor" : "none"} />
                  )}
                  <span>{message.likeCount}</span>
                </button>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle size={14} />
                  {message.comments.length}
                </span>
              </div>

              <div className="space-y-2">
                {message.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 px-3 py-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {comment.user.name || "Bez imena"}
                      </span>
                      <span>{new Date(comment.createdAt).toLocaleString("sr-RS")}</span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={commentDrafts[message.id] || ""}
                  onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [message.id]: e.target.value }))}
                  placeholder="Napiši komentar..."
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                />
                <button
                  onClick={() => handleAddComment(message.id)}
                  disabled={commentPending === message.id || !(commentDrafts[message.id]?.trim())}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {commentPending === message.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
