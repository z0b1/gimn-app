import { Navbar } from "@/components/layout/Navbar";
import { MessageSquare, Heart, MessageCircle, Share2, Plus, Image as ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

const mockPosts = [
  {
    id: "1",
    user: "Filip M.",
    role: "Učenik (IV-1)",
    content: "Pogledajte kako izgleda nova laboratorija za fiziku! Konačno imamo modernu opremu za eksperimente. 🚀",
    mediaUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
    mediaType: "IMAGE",
    likes: 124,
    comments: 12,
    time: "pre 2h"
  },
  {
    id: "2",
    user: "Ana K.",
    role: "Učenik (II-3)",
    content: "Da li je neko zainteresovan da pokrenemo klub knjige? Mogli bismo da se okupljamo utorkom u biblioteci. 📚",
    likes: 56,
    comments: 24,
    time: "pre 5h"
  },
  {
    id: "3",
    user: "Marko J.",
    role: "Admin parlamenta",
    content: "Kratak video sa jučerašnje sednice parlamenta gde smo diskutovali o novim pravilima. Tvoj glas pravi razliku!",
    mediaUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    mediaType: "VIDEO",
    likes: 89,
    comments: 5,
    time: "pre 1 dan"
  }
];

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
              <MessageSquare size={20} />
              <span>Gimnazija Feed</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Zajednica</h1>
          </div>
          <button className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Plus size={24} />
          </button>
        </header>

        {/* Create Post Placeholder */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-10">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
              <div className="flex-grow">
                 <textarea 
                    placeholder="Šta ima novo u školi?"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 min-h-[100px] resize-none"
                 />
                 <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                       <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                          <ImageIcon size={20} />
                       </button>
                       <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                          <Film size={20} />
                       </button>
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                       Objavi
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
          {mockPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                    {post.user[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1">{post.user}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <span>{post.role}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-6">
                  {post.content}
                </p>

                {post.mediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100 max-h-[500px]">
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media"
                      className="w-full h-full object-cover"
                    />
                    {post.mediaType === "VIDEO" && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="bg-white/90 p-4 rounded-full shadow-lg">
                             <Film size={32} className="text-indigo-600" />
                          </div>
                       </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                      <Heart size={20} className="group-active:scale-125 transition-transform" />
                      <span className="font-bold text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                      <MessageCircle size={20} />
                      <span className="font-bold text-sm">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
