import { Navbar } from "@/components/layout/Navbar";
import { Landmark, MessageCircle, HelpCircle, ChevronRight } from "lucide-react";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/roles";
import { AdminQuestionActions } from "@/components/qna/AdminQuestionActions";

export const dynamic = "force-dynamic";

export default async function PitanjaPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    }
  });

  const isUserAdmin = isAdmin();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
            <HelpCircle size={20} />
            <span>Pitanja i Sugestije</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">Pitajte parlament</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Imaš pitanje ili ideju? Pošalji nam direktno i pratite odgovore.</p>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none p-8 mb-12 transition-colors">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Postavi novo pitanje</h3>
           <textarea 
              placeholder="Napiši svoje pitanje ovde..."
              className="w-full bg-slate-50 dark:bg-slate-950/50 border-none rounded-2xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 min-h-[150px] resize-none mb-6 transition-colors"
           />
           <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
              Pošalji pitanje
              <ChevronRight size={20} />
           </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 transition-colors">Poslednji odgovori</h3>
          {questions.length > 0 ? questions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
              <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors">
                       {q.user.name?.[0] || "U"}
                    </div>
                    <div>
                       <div className="font-bold text-slate-900 dark:text-white transition-colors">{q.user.name}</div>
                       <div className="text-slate-400 dark:text-slate-500 text-xs transition-colors">{q.createdAt.toLocaleDateString("sr-RS")}</div>
                    </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    q.answer ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                 }`}>
                    {q.answer ? "ODGOVORENO" : "U OBRADI"}
                 </span>
              </div>
              
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 transition-colors">
                &quot;{q.content}&quot;
              </p>

              {q.answer ? (
                <div className="bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl p-6 border border-indigo-50 dark:border-indigo-900/50 transition-colors">
                   <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-3">
                      <MessageCircle size={16} />
                      Odgovor parlamenta:
                   </div>
                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic transition-colors">
                      {q.answer}
                   </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">
                   <Landmark size={16} />
                   Čeka se odgovor...
                </div>
              )}
              
              {isUserAdmin && !q.answer && (
                <AdminQuestionActions questionId={q.id} content={q.content} />
              )}
            </div>
          )) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
               Još uvek nema postavljenih pitanja.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
