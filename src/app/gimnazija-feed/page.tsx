import { Navbar } from "@/components/layout/Navbar";
import { MessageSquare, Heart, MessageCircle, Share2, Plus } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { PostForm } from "@/components/feed/PostForm";
import { currentUser } from "@clerk/nextjs/server";

export default async function FeedPage() {
  const posts = await prisma.gimnazijaFeedPost.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const user = await currentUser();

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

        <PostForm userAvatar={user?.imageUrl} />

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
                    {post.user.name ? post.user.name[0] : "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1">{post.user.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <span>{post.user.role === "ADMIN" ? "Admin" : "Učenik"}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("sr-RS", { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.mediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100 h-80">
                    <Image 
                      src={post.mediaUrl} 
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                      <Heart size={20} className="group-active:scale-125 transition-transform" />
                      <span className="font-bold text-sm">0</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                      <MessageCircle size={20} />
                      <span className="font-bold text-sm">0</span>
                    </button>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Još uvek nema objava. Budi prvi koji će nešto podeliti!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
