"use client";

import { useState } from "react";
import { deleteQuestion } from "@/lib/actions/questions";
import { Trash2, Loader2 } from "lucide-react";
import { EditQuestionDialog } from "./EditQuestionDialog";

interface UserQuestionActionsProps {
  questionId: string;
  content: string;
}

export function UserQuestionActions({ questionId, content }: UserQuestionActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovo pitanje?")) return;
    
    setIsDeleting(true);
    try {
      await deleteQuestion(questionId);
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju pitanja.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <EditQuestionDialog questionId={questionId} initialContent={content} />
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all"
        title="Obriši"
      >
        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
