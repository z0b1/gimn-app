import { Navbar } from "@/components/layout/Navbar";
import { Landmark, MessageCircle, HelpCircle, ChevronRight } from "lucide-react";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PitanjaPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
            <HelpCircle size={20} />
            <span>Pitanja i Sugestije</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Pitajte parlament</h1>
          <p className="text-slate-500 mt-2">Imaš pitanje ili ideju? Pošalji nam direktno i pratite odgovore.</p>
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/10 p-8 mb-12">
           <h3 className="text-xl font-bold mb-6">Postavi novo pitanje</h3>
           <textarea 
              placeholder="Napiši svoje pitanje ovde..."
              className="w-full bg-slate-50 border-none rounded-2xl p-6 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 min-h-[150px] resize-none mb-6"
           />
           <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
              Pošalji pitanje
              <ChevronRight size={20} />
           </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Poslednji odgovori</h3>
          {questions.length > 0 ? questions.map((q) => (
            <div key={q.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                       {q.user.name?.[0] || "U"}
                    </div>
                    <div>
                       <div className="font-bold text-slate-900">{q.user.name}</div>
                       <div className="text-slate-400 text-xs">{q.createdAt.toLocaleDateString("sr-RS")}</div>
                    </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    q.answer ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                 }`}>
                    {q.answer ? "ODGOVORENO" : "U OBRADI"}
                 </span>
              </div>
              
              <p className="text-lg font-medium text-slate-800 mb-6">
                &quot;{q.content}&quot;
              </p>

              {q.answer ? (
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-50">
                   <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
                      <MessageCircle size={16} />
                      Odgovor parlamenta:
                   </div>
                   <p className="text-slate-700 leading-relaxed italic">
                      {q.answer}
                   </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                   <Landmark size={16} />
                   Čeka se odgovor...
                </div>
              )}
            </div>
          )) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-500">
               Još uvek nema postavljenih pitanja.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
