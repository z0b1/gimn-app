"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteNews, deleteRule, deleteFeedPost } from "@/lib/actions/posts";

interface DeleteButtonProps {
  id: string;
  type: "news" | "rule" | "feed";
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj sadržaj?")) return;

    setIsPending(true);
    try {
      if (type === "news") await deleteNews(id);
      else if (type === "rule") await deleteRule(id);
      else if (type === "feed") await deleteFeedPost(id);
    } catch (error) {
      console.error(error);
      alert("Došlo je do greške prilikom brisanja.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
      title="Obriši"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
