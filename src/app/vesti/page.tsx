import { Navbar } from "@/components/layout/Navbar";
import { Bell, Calendar, ChevronRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/roles";
import { NewsFormModal } from "@/components/admin/NewsFormModal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VestiPage() {
  const news = await prisma.news.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const admin = isAdmin();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
              <Bell size={20} />
              <span>Vesti i Obaveštenja</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">Najnovije iz Gimnazije</h1>
          </div>
          {admin && (
            <NewsFormModal 
              trigger={
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Nova vest
                </button>
              }
            />
          )}
        </header>

        <div className="grid grid-cols-1 gap-8">
          {news.map((item) => (
            <article key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row h-full group">
              {item.mediaUrl && (
                <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0 bg-slate-200 dark:bg-slate-800 transition-colors">
                  <Image 
                    src={item.mediaUrl} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.mediaType === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg">
                        <PlayCircle size={32} className="text-indigo-600" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-8 flex flex-col justify-center flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider transition-colors">
                    {item.mediaType === "VIDEO" ? "Video" : "Vesti"}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm transition-colors">
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString("sr-RS", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3 transition-colors">
                  {item.content}
                </p>
                
                <Link
                  href={`/vesti/${item.id}`}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all"
                >
                  Pročitaj više
                  <ChevronRight size={20} />
                </Link>
              </div>
            </article>
          ))}

          {news.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <p className="text-slate-400 dark:text-slate-500 font-medium">Trenutno nema vesti.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
