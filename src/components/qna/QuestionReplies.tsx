"use client";

import { useState } from "react";
import { addReply, resolveQuestion } from "@/lib/actions/questions";
import { MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyData {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string | null };
}

interface QuestionRepliesProps {
  questionId: string;
  initialReplies: ReplyData[];
  isCurrentUserAdmin: boolean;
  isLoggedIn: boolean;
  isResolved: boolean;
}

export function QuestionReplies({
  questionId,
  initialReplies,
  isCurrentUserAdmin,
  isLoggedIn,
  isResolved,
}: QuestionRepliesProps) {
  const [replies, setReplies] = useState<ReplyData[]>(initialReplies);
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolved, setResolved] = useState(isResolved);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    setIsSubmitting(true);
    try {
      await addReply(questionId, newReply);
      setReplies([
        ...replies,
        {
          id: Math.random().toString(),
          content: newReply,
          createdAt: new Date().toISOString(),
          user: { name: "Vi" },
        },
      ]);
      setNewReply("");
    } catch (err) {
      console.error(err);
      alert("Greška pri slanju odgovora.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!confirm("Jeste li sigurni da želite da označite ovo pitanje kao rešeno?")) return;
    setIsResolving(true);
    try {
      await resolveQuestion(questionId);
      setResolved(true);
    } catch (err) {
      console.error(err);
      alert("Greška pri označavanju pitanja.");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className={cn(
            "flex items-center gap-2 text-sm font-bold transition-colors",
            showReplies
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          )}
        >
          <MessageCircle size={16} />
          {replies.length > 0
            ? `${replies.length} ${replies.length === 1 ? "odgovor" : "odgovora"}`
            : "Odgovori"}
        </button>

        {isCurrentUserAdmin && !resolved && (
          <button
            onClick={handleResolve}
            disabled={isResolving}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            {isResolving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle size={14} />
            )}
            Označi kao rešeno
          </button>
        )}
      </div>

      {showReplies && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {replies.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {reply.user.name || "Korisnik"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(reply.createdAt).toLocaleDateString("sr-RS", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 transition-colors">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center text-slate-400 dark:text-slate-500 py-2">
              Nema odgovora još. Budi prvi!
            </p>
          )}

          {isLoggedIn && !resolved ? (
            <form onSubmit={handleReplySubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Napiši odgovor..."
                disabled={isSubmitting}
                className="flex-grow bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newReply.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          ) : !isLoggedIn ? (
            <p className="text-xs text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-3 transition-colors">
              Moraš biti prijavljen/a da bi odgovorio/la.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
