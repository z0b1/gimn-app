import { Navbar } from "@/components/layout/Navbar";
import { MessageSquare, Plus } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { PostForm } from "@/components/feed/PostForm";
import { FeedInteractions } from "@/components/feed/FeedInteractions";
import { ShareButton } from "@/components/feed/ShareButton";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/actions/posts";

export default async function FeedPage() {
  const posts = await prisma.gimnazijaFeedPost.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const user = await currentUser();
  const dbUser = await getOrCreateUser();

  if (user && dbUser && user.imageUrl !== dbUser.imageUrl) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { imageUrl: user.imageUrl },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-primary dark:text-brand-accent font-semibold mb-2">
              <MessageSquare size={20} />
              <span>Gimnazija Feed</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">Zajednica</h1>
          </div>
          <button className="bg-brand-primary text-white p-4 rounded-2xl shadow-xl hover:bg-brand-primary/90 transition-all">
             <Plus size={24} />
          </button>
        </header>

        <PostForm userAvatar={user?.imageUrl} />

        <div className="space-y-8">
          {posts.map((post) => (
            <article id={post.id} key={post.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {post.user.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={post.user.imageUrl}
                        alt={post.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
                      {post.user.name ? post.user.name[0] : "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-none mb-1 transition-colors">{post.user.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium transition-colors">
                      <span>{post.user.role === "ADMIN" ? "Admin" : post.user.role === "REDAKCIJA" ? "Redakcija" : "Učenik"}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("sr-Latn-RS", { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap transition-colors">
                  {post.content}
                </p>

                {post.mediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 min-h-[200px] flex items-center justify-center transition-colors">
                    {post.mediaType === "VIDEO" ? (
                      <video 
                        src={post.mediaUrl} 
                        controls 
                        className="w-full h-auto max-h-[500px]"
                      />
                    ) : (
                      <div className="relative w-full h-80">
                        <Image 
                          src={post.mediaUrl} 
                          alt="Post media"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
                  <FeedInteractions 
                    postId={post.id}
                    currentUserId={dbUser?.id || null}
                    currentUserImage={dbUser?.imageUrl || null}
                    initialLikes={post.likes.map(l => l.userId)}
                    initialComments={post.comments.map(c => ({
                      id: c.id,
                      content: c.content,
                      createdAt: c.createdAt.toISOString(),
                      user: { name: c.user.name, imageUrl: c.user.imageUrl }
                    }))}
                  />
                  
                  <div className="self-start mt-6 ml-auto pl-4">
                    <ShareButton postId={post.id} />
                  </div>
                </div>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <p className="text-slate-400 dark:text-slate-500 font-medium">Još uvek nema objava. Budi prvi koji će nešto podeliti!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
