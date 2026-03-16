"use client";

import { useState } from "react";
import { updateNewsBody } from "@/lib/actions/posts";
import { Loader2, Save } from "lucide-react";

export function NewsBodyEditor({
  newsId,
  initialBody,
}: {
  newsId: string;
  initialBody: string;
}) {
  const [body, setBody] = useState(initialBody);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await updateNewsBody(newsId, body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri čuvanju.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full min-h-[240px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
        placeholder="Unesi puni tekst članka..."
      />
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Sačuvaj članak
      </button>
    </form>
  );
}
