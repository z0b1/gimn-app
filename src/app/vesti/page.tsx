import { Navbar } from "@/components/layout/Navbar";
import { Bell, Calendar, ChevronRight, PlayCircle, Image as ImageIcon } from "lucide-react";

const mockNews = [
  {
    id: "1",
    title: "Novi pravilnik o ponašanju učenika",
    content: "Danas je đački parlament usvojio novi pravilnik koji stupa na snagu od ponedeljka. Glavne promene se odnose na...",
    date: "14. Mart 2026",
    mediaUrl: "https://images.unsplash.com/photo-1544928147-79723465d9d4?q=80&w=800&auto=format&fit=crop",
    mediaType: "IMAGE",
    category: "Pravila"
  },
  {
    id: "2",
    title: "Reportaža sa turnira u košarci",
    content: "Pogledajte najbolje momente sa finalne utakmice između odeljenja IV-1 i IV-3.",
    date: "12. Mart 2026",
    mediaUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    mediaType: "VIDEO",
    category: "Sport"
  },
  {
    id: "3",
    title: "Gostujuće predavanje: Budućnost veštačke inteligencije",
    content: "Sledećeg četvrtka u svečanoj sali ugostićemo profesore sa srodnih fakulteta...",
    date: "10. Mart 2026",
    mediaUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    mediaType: "IMAGE",
    category: "Događaji"
  }
];

export default function VestiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
            <Bell size={20} />
            <span>Vesti i Obaveštenja</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Najnovije iz Gimnazije</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {mockNews.map((news) => (
            <article key={news.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row h-full">
              {news.mediaUrl && (
                <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0 bg-slate-200">
                  <img 
                    src={news.mediaUrl} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  {news.mediaType === "VIDEO" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg">
                        <PlayCircle size={32} className="text-indigo-600" />
                      </div>
                    </div>
                  )}
                  {news.mediaType === "IMAGE" && (
                     <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                        <ImageIcon size={12} />
                        Slika
                     </div>
                  )}
                </div>
              )}
              
              <div className="p-8 flex flex-col justify-center flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {news.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Calendar size={14} />
                    {news.date}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {news.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {news.content}
                </p>
                
                <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                  Pročitaj više
                  <ChevronRight size={20} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
