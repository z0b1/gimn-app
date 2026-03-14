"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewsForm } from "./NewsForm";

export function NewsFormModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white flex items-center gap-2 px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all font-bold"
      >
        <Plus size={24} />
        Nova vest
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <NewsForm 
             onClose={() => setIsOpen(false)} 
             onSuccess={() => setIsOpen(false)}
           />
        </div>
      )}
    </>
  );
}
