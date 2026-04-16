"use client";

import { useState } from "react";
import { createRule } from "@/lib/actions/posts";
import { X, Send, Vote, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "../shared/ImageUpload";

interface RuleFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function RuleForm({ onSuccess, onClose }: RuleFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createRule(formData);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nešto je pošlo po zlu.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 w-full max-w-2xl relative z-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Vote size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Novi predlog / Pravilo</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Naslov predloga</label>
          <input
            name="title"
            required
            placeholder="Npr. Novi pravilnik o oblačenju..."
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-100 transition-all font-semibold"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Opis i detalji</label>
          <textarea
            name="description"
            required
            placeholder="Detaljno objasni predlog učenicima..."
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-100 min-h-[200px] resize-none transition-all"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Trajanje glasanja</label>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
            <input
              name="voteDurationValue"
              type="number"
              min={1}
              defaultValue={7}
              required
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-100 transition-all font-semibold"
              disabled={isPending}
            />
            <select
              name="voteDurationUnit"
              defaultValue="days"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-violet-100 transition-all font-semibold"
              disabled={isPending}
            >
              <option value="minutes">Minuti</option>
              <option value="hours">Sati</option>
              <option value="days">Dani</option>
            </select>
          </div>
        </div>

        <div>
           <button
             type="button"
             onClick={() => setShowUpload(!showUpload)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showUpload ? 'bg-violet-50 text-violet-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
           >
             <ImageIcon size={18} />
             {showUpload ? "Ukloni prilog" : "Dodaj sliku ili video (opciono)"}
           </button>

           {showUpload && (
             <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
               <ImageUpload 
                 onUploadComplete={(url) => console.log("Uploaded:", url)}
                 onUploadError={(err) => setError(err)}
                 onClear={() => setShowUpload(false)}
               />
             </div>
           )}
        </div>

        {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}

        <div className="flex gap-4 pt-4">
           {onClose && (
             <button
               type="button"
               onClick={onClose}
               className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
             >
               Otkaži
             </button>
           )}
           <button
             type="submit"
             disabled={isPending}
             className="flex-[2] bg-violet-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 disabled:opacity-50"
           >
             {isPending ? "Objavljivanje..." : (
               <>
                 <Send size={20} />
                 Objavi predlog
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
}
