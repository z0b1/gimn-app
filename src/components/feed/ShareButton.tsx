"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  postId: string;
}

export function ShareButton({ postId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/gimnazija-feed#${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      prompt("Kopiraj link:", url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-slate-400 hover:text-brand-accent dark:hover:text-brand-secondary transition-colors"
      title="Kopiraj link"
    >
      {copied ? (
        <>
          <Check size={18} className="text-emerald-500" />
          <span className="text-xs font-bold text-emerald-500">Kopirano!</span>
        </>
      ) : (
        <Share2 size={18} />
      )}
    </button>
  );
}
