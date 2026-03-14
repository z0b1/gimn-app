"use client";

import { useState } from "react";
import { toggleLike, addComment } from "@/lib/actions/feed";
import { Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentData {
  id: string;
  content: string;
  createdAt: string; // ISO string 
  user: {
    name: string | null;
  };
}

interface FeedInteractionsProps {
  postId: string;
  currentUserId: string | null; // Database user ID
  initialLikes: string[]; // Array of User IDs who liked this
  initialComments: CommentData[];
}

export function FeedInteractions({ postId, currentUserId, initialLikes, initialComments }: FeedInteractionsProps) {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const hasLiked = currentUserId ? likes.includes(currentUserId) : false;

  const handleLike = async () => {
    if (!currentUserId) {
        alert("Morate biti prijavljeni da biste lajkovali objavu.");
        return;
    }
    
    // Optimistic Update
    setIsLiking(true);
    if (hasLiked) {
      setLikes(likes.filter(id => id !== currentUserId));
    } else {
      setLikes([...likes, currentUserId]);
    }

    try {
      await toggleLike(postId);
    } catch (error) {
       // Revert on failure
       console.error("Failed to like:", error);
       if (hasLiked) {
         setLikes([...likes, currentUserId]);
       } else {
         setLikes(likes.filter(id => id !== currentUserId));
       }
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Morate biti prijavljeni da biste komentarisali.");
      return;
    }
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
       await addComment(postId, newComment);
       // Server will revalidate and provide the exact new data on hard load, 
       // but we do a soft optimistic push here so it feels fast
       setComments([
         ...comments, 
         {
           id: Math.random().toString(),
           content: newComment,
           createdAt: new Date().toISOString(),
           user: { name: "Vi" }
         }
       ]);
       setNewComment("");
    } catch (error) {
       console.error("Failed to post comment:", error);
       alert("Greška pri postavljanju komentara.");
    } finally {
       setIsCommenting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
        <button 
           onClick={handleLike}
           disabled={isLiking}
           className={cn(
             "flex items-center gap-2 transition-colors group disabled:opacity-50",
             hasLiked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
           )}
        >
          <Heart 
            size={20} 
            className={cn(
               "transition-all duration-300", 
               hasLiked ? "fill-current scale-110" : "group-hover:scale-110"
            )} 
          />
          <span className="font-bold text-sm">{likes.length}</span>
        </button>
        
        <button 
           onClick={() => setShowComments(!showComments)}
           className={cn(
             "flex items-center gap-2 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400",
             showComments ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"
           )}
        >
          <MessageCircle size={20} />
          <span className="font-bold text-sm">{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
           
           {/* Comment List */}
           <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
             {comments.length > 0 ? comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl transition-colors">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white transition-colors">{comment.user.name || "Korisnik"}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.createdAt).toLocaleDateString("sr-RS", { hour: '2-digit', minute: '2-digit'})}</span>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-300 transition-colors">{comment.content}</p>
                </div>
             )) : (
                <p className="text-sm text-center text-slate-400 dark:text-slate-500 transition-colors">Nema komentara. Budi prvi!</p>
             )}
           </div>

           {/* Add Comment Form */}
           {currentUserId ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input 
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Napiši komentar..."
                  className="flex-grow bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  disabled={isCommenting}
                />
                <button 
                  type="submit" 
                  disabled={isCommenting || !newComment.trim()}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isCommenting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
           ) : (
              <p className="text-xs text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-3 transition-colors">
                 Moraš biti prijavljen/a da bi ostavio/la komentar.
              </p>
           )}
        </div>
      )}
    </div>
  );
}
