"use client";

import { useState } from "react";
import { castVote } from "@/lib/actions/posts";

interface VoteButtonsProps {
  ruleId: string;
  isExpired: boolean;
}

export function VoteButtons({ ruleId, isExpired }: VoteButtonsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleVote = async (value: boolean) => {
    if (isExpired) return;
    
    setIsPending(true);
    try {
      await castVote(ruleId, value);
    } catch (error) {
       console.error(error);
       alert(error instanceof Error ? error.message : "Nešto je pošlo po zlu.");
    } finally {
      setIsPending(false);
    }
  };

  if (isExpired) return null;

  return (
    <div className="flex flex-col gap-3 justify-center min-w-[200px]">
      <button 
        onClick={() => handleVote(true)}
        disabled={isPending}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
      >
        {isPending ? "Glasanje..." : "Glasaj ZA"}
      </button>
      <button 
        onClick={() => handleVote(false)}
        disabled={isPending}
        className="w-full bg-white text-slate-900 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
      >
        {isPending ? "Glasanje..." : "Glasaj PROTIV"}
      </button>
    </div>
  );
}
