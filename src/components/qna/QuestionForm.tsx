"use client";

import { useState } from "react";
import { submitQuestion } from "@/lib/actions/questions";
import { ChevronRight, Loader2 } from "lucide-react";

export function QuestionForm() {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPending(true);
    try {
      await submitQuestion(content);
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Greška pri slanju pitanja. Molimo pokušaj ponovo.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none p-8 mb-12 transition-colors">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Postavi novo pitanje</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Napiši svoje pitanje ovde..."
        disabled={isPending}
        className="w-full bg-slate-50 dark:bg-slate-950/50 border-none rounded-2xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 min-h-[150px] resize-none mb-6 transition-colors"
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} />}
          Pošalji pitanje
        </button>
        {success && (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-300">
            ✓ Pitanje poslano!
          </span>
        )}
      </div>
    </form>
  );
}
