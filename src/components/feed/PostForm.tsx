"use client";

import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { createFeedPost } from "@/lib/actions/posts";
import Image from "next/image";
import { ImageUpload } from "../shared/ImageUpload";

interface PostFormProps {
  userAvatar?: string;
}

export function PostForm({ userAvatar }: PostFormProps) {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createFeedPost(formData);
      setContent("");
      setShowUpload(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nešto je pošlo po zlu.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-10">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
          {userAvatar ? (
            <Image src={userAvatar} alt="User" width={48} height={48} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500" />
          )}
        </div>
        <div className="flex-grow">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Šta ima novo u školi?"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 min-h-[100px] resize-none transition-all"
            disabled={isPending}
          />

          {showUpload && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
               <ImageUpload 
                 onUploadComplete={() => {}}
                 onUploadError={(err) => setError(err)}
               />
            </div>
          )}
          
          {error && <p className="text-rose-500 text-sm mt-2 font-medium">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowUpload(!showUpload)}
                className={`p-2.5 rounded-xl transition-all ${showUpload ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                title="Dodaj sliku ili video"
              >
                {showUpload ? <X size={20} /> : <ImageIcon size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Objavljivanje..." : "Objavi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
