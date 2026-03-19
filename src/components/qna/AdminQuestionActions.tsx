"use client";

import { useState } from "react";
import { answerQuestion, handleProposal } from "@/lib/actions/questions";
import { Loader2, Send, CheckCircle, XCircle } from "lucide-react";

interface AdminQuestionActionsProps {
  questionId: string;
  content: string;
}

export function AdminQuestionActions({ questionId, content }: AdminQuestionActionsProps) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isProposal = content.startsWith("[PREDLOG:");

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) return;
    setIsPending(true);
    try {
      await answerQuestion(questionId, answerText);
      setIsAnswering(false);
    } catch (error) {
      console.error(error);
      alert("Greška pri slanju odgovora.");
    } finally {
      setIsPending(false);
    }
  };

  const handleProposalAction = async (accept: boolean) => {
    let reason = "";
    if (!accept) {
      const promptReason = prompt("Unesite razlog za odbijanje predloga:");
      if (promptReason === null) return; // User canceled
      reason = promptReason;
    }

    setIsPending(true);
    try {
      await handleProposal(questionId, accept, content, reason);
    } catch (error) {
      console.error(error);
      alert("Greška pri obradi predloga.");
    } finally {
      setIsPending(false);
    }
  };

  if (isProposal) {
    return (
      <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="w-full mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin Akcije za Predlog</span>
        </div>
        <button
          onClick={() => handleProposalAction(true)}
          disabled={isPending}
          className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          Prihvati i kreiraj glasanje
        </button>
        <button
          onClick={() => handleProposalAction(false)}
          disabled={isPending}
          className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
          Odbij predlog
        </button>
      </div>
    );
  }

  // Standard Question
  return (
    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
      {!isAnswering ? (
        <button
          onClick={() => setIsAnswering(true)}
          className="text-sm font-bold text-brand-primary dark:text-indigo-400 hover:text-brand-accent dark:hover:text-indigo-300 transition-colors"
        >
          Odgovori na pitanje
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={isPending}
            placeholder="Napišite odgovor parlamenta..."
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors min-h-[100px] resize-y"
            autoFocus
          />
          <div className="flex items-center gap-2 justify-end">
             <button
                onClick={() => setIsAnswering(false)}
                disabled={isPending}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 px-3 py-2 rounded-lg transition-colors"
             >
                Otkaži
             </button>
             <button
                onClick={handleAnswerSubmit}
                disabled={isPending || !answerText.trim()}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-brand-accent transition-colors disabled:opacity-50"
             >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Pošalji odgovor
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
