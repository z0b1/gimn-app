import { Navbar } from "@/components/layout/Navbar";
import prisma from "@/lib/db";
import Image from "next/image";
import { Calendar, UserRound } from "lucide-react";
import { NewsBodyEditor } from "@/components/admin/NewsBodyEditor";
import { isAdmin } from "@/lib/roles";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const admin = isAdmin();

  const news = await prisma.news.findUnique({
    where: { id: params.id },
    include: {
      lastEditedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!news || !news.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 flex flex-col md:flex-row gap-6 transition-colors">
            {news.mediaUrl && (
              <div className="relative w-full md:w-64 h-48 md:h-40 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image src={news.mediaUrl} alt={news.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Calendar size={16} />
                {new Date(news.createdAt).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{news.title}</h1>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{news.content}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <UserRound size={14} />
                <span>Poslednja izmena: {news.lastEditedBy?.name || "Nepoznato"}</span>
                <span className="text-slate-400">·</span>
                <span>{new Date(news.lastEditedAt).toLocaleString("sr-Latn-RS")}</span>
              </div>
            </div>
          </header>

          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Puni članak</h2>
              {admin && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">ADMIN</span>}
            </div>

            {admin ? (
              <NewsBodyEditor newsId={news.id} initialBody={news.body || ""} />
            ) : news.body ? (
              <article className="prose prose-slate dark:prose-invert max-w-none">
                {news.body.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </article>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Tekst članka još nije dodat.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
