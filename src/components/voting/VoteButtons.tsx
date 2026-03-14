"use client";

import { useState } from "react";
import { castVote } from "@/lib/actions/posts";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  ruleId: string;
  isExpired: boolean;
  initialUserVote: boolean | null;
}

export function VoteButtons({ ruleId, isExpired, initialUserVote }: VoteButtonsProps) {
  const [isPending, setIsPending] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(initialUserVote);
  const [isEditing, setIsEditing] = useState(initialUserVote === null);

  const handleVote = async (value: boolean) => {
    if (isExpired) return;
    
    setIsPending(true);
    try {
      await castVote(ruleId, value);
      setUserVote(value);
      setIsEditing(false);
    } catch (error) {
       console.error(error);
       alert(error instanceof Error ? error.message : "Nešto je pošlo po zlu.");
    } finally {
      setIsPending(false);
    }
  };

  if (isExpired) return null;

  if (!isEditing && userVote !== null) {
    return (
      <div className="flex flex-col gap-4 justify-center w-full md:min-w-[200px]">
        <div className={cn(
          "p-4 rounded-2xl border-2 flex flex-col items-center gap-2",
          userVote 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
            : "bg-rose-50 border-rose-200 text-rose-700"
        )}>
          <span className="text-[10px] font-bold uppercase tracking-widest">Tvoj glas</span>
          <span className="font-black text-xl">{userVote ? "ZA" : "PROTIV"}</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors py-2"
        >
          Promeni glas
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 justify-center w-full md:min-w-[200px]">
      <button 
        onClick={() => handleVote(true)}
        disabled={isPending || (userVote === true && !isEditing)}
        className={cn(
          "w-full py-4 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50",
          userVote === true
            ? "bg-emerald-600 text-white shadow-emerald-100"
            : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
        )}
      >
        {isPending ? "Glasanje..." : "Glasaj ZA"}
      </button>
      <button 
        onClick={() => handleVote(false)}
        disabled={isPending || (userVote === false && !isEditing)}
        className={cn(
          "w-full py-4 rounded-2xl font-bold transition-all disabled:opacity-50",
          userVote === false
            ? "bg-rose-600 text-white"
            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
        )}
      >
        {isPending ? "Glasanje..." : "Glasaj PROTIV"}
      </button>
      {initialUserVote !== null && isEditing && (
        <button
          onClick={() => setIsEditing(false)}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Odustani
        </button>
      )}
    </div>
  );
}
