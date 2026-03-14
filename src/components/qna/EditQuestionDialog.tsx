"use client";

import { useState } from "react";
import { updateQuestion } from "@/lib/actions/questions";
import { Edit2, Loader2, X } from "lucide-react";

interface EditQuestionDialogProps {
  questionId: string;
  initialContent: string;
}

export function EditQuestionDialog({ questionId, initialContent }: EditQuestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim() || content === initialContent) {
      setIsOpen(false);
      return;
    }

    setIsPending(true);
    try {
      await updateQuestion(questionId, content);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Greška pri izmeni pitanja.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-all"
        title="Izmeni"
      >
        <Edit2 size={16} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Izmeni pitanje</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-950/50 border-none rounded-2xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 min-h-[150px] resize-none mb-6 transition-colors"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={handleUpdate}
            disabled={isPending || !content.trim()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
          >
            {isPending && <Loader2 size={18} className="animate-spin" />}
            Sačuvaj izmene
          </button>
        </div>
      </div>
    </div>
  );
}
