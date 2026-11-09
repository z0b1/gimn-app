"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { addNewsImages, removeNewsImage, updateNewsDetails } from "@/lib/actions/posts";

interface NewsManagePanelProps {
  newsId: string;
  authors: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  images: string[];
}

export function NewsManagePanel({ newsId, authors, mediaUrl, mediaType, images }: NewsManagePanelProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    setError(null);
    try {
      await updateNewsDetails(newsId, new FormData(e.currentTarget));
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri čuvanju.");
    } finally {
      setPending(false);
    }
  };

  const handleRemoveImage = async (url: string) => {
    setRemoving(url);
    setError(null);
    try {
      await removeNewsImage(newsId, url);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri brisanju slike.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Uređivanje vesti</h2>

      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Autori</label>
          <input
            name="authors"
            defaultValue={authors || ""}
            placeholder="npr. Ana Petrović, Marko Jovanović"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Naslovna slika ili video</label>
          <ImageUpload
            defaultValue={mediaUrl || undefined}
            defaultMediaType={mediaType || undefined}
            onUploadComplete={() => setSaved(false)}
            onUploadError={(err) => setError(err)}
            onClear={() => setSaved(false)}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-accent disabled:opacity-50 transition-colors"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Sačuvaj izmene
        </button>
        {saved && <span className="ml-3 text-sm text-emerald-600 dark:text-emerald-400">Sačuvano.</span>}
      </form>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Galerija slika</h3>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((url) => (
              <div key={url} className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  disabled={removing === url}
                  className="absolute top-2 right-2 p-2 bg-slate-900/60 hover:bg-rose-600 rounded-full text-white transition-colors disabled:opacity-50"
                  aria-label="Ukloni sliku"
                >
                  {removing === url ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}

        <UploadDropzone<OurFileRouter, "newsImageUploader">
          endpoint="newsImageUploader"
          onClientUploadComplete={async (res) => {
            setError(null);
            try {
              await addNewsImages(newsId, res.map((file) => file.url));
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Greška pri dodavanju slika.");
            }
          }}
          onUploadError={(err: Error) => setError(err.message)}
          className="ut-label:text-brand-primary ut-label:font-semibold ut-button:bg-brand-primary ut-allowed-content:text-slate-600 ut-allowed-content:dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl bg-slate-100 dark:bg-slate-800 p-8"
          content={{
            label: "Klikni ili prevuci slike",
            allowedContent: "Do 10 slika odjednom (4MB po slici)",
          }}
        />
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
    </section>
  );
}
