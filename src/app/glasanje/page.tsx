import { Navbar } from "@/components/layout/Navbar";
import { Vote, ChevronRight, Info, CheckCircle2, History, XCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { VoteButtons } from "@/components/voting/VoteButtons";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function GlasanjePage() {
  const { userId: clerkId } = auth();

  const activeRules = await prisma.rule.findMany({
    include: {
      votes: true,
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const dbUser = clerkId ? await prisma.user.findUnique({
    where: { clerkId },
    include: { votes: true }
  }) : null;

  const now = new Date();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
              <Vote size={20} />
              <span>Digitalno Glasanje</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Aktuelni predlozi</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Učestvuj u donošenju odluka koje se tiču svih nas.</p>
          </div>
          <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-indigo-50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <History size={18} />
            Arhiva glasanja
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {activeRules && activeRules.length > 0 ? activeRules.map((rule) => {
            if (!rule) return null;
            const expiryDate = new Date(rule.createdAt);
            expiryDate.setDate(expiryDate.getDate() + 7);
            const isExpired = now > expiryDate;
            
            const votes = rule.votes || [];
            const yesVotes = votes.filter(v => v.value === true).length;
            const noVotes = votes.filter(v => v.value === false).length;
            const isAccepted = isExpired && yesVotes > noVotes;

            const userVote = dbUser?.votes.find(v => v.ruleId === rule.id);
            const currentUserVote = userVote !== undefined ? userVote.value : null;

            return (
              <VoteCard 
                key={rule.id}
                ruleId={rule.id}
                title={rule.title}
                description={rule.description}
                isExpired={isExpired}
                isAccepted={isAccepted}
                yesVotes={yesVotes}
                noVotes={noVotes}
                participation={(rule._count?.votes ?? 0).toString()}
                currentUserVote={currentUserVote}
              />
            );
          }) : (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-12 text-center transition-colors">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Trenutno nema aktivnih glasanja.</p>
            </div>
          )}
        </div>

        <section className="mt-16 bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none transition-colors">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-3xl font-bold mb-4">Imaš svoj predlog?</h2>
                 <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                    Svaki učenik ima pravo da predloži promenu. Prikupi 50 potpisa podrške i tvoj predlog će se naći na glasanju.
                 </p>
                 <Link 
                    href="/glasanje/novi-predlog"
                    className="inline-flex bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-xl dark:shadow-none items-center gap-3 group"
                 >
                    Predloži glasanje
                    <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

interface VoteCardProps {
  ruleId: string;
  title: string;
  description: string;
  isExpired: boolean;
  isAccepted: boolean;
  yesVotes: number;
  noVotes: number;
  participation: string;
  currentUserVote: boolean | null;
}

function VoteCard({ ruleId, title, description, isExpired, isAccepted, yesVotes, noVotes, participation, currentUserVote }: VoteCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
             {isExpired ? (
                isAccepted ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    PRIHVAĆENO
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                    <XCircle size={12} />
                    ODBIJENO
                  </span>
                )
             ) : (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  Aktivno
                </span>
             )}
             <span className="text-slate-400 dark:text-slate-500 text-xs font-medium flex items-center gap-1">
                <Info size={14} />
                {isExpired ? "Glasanje završeno" : "Još manje od 7 dana"}
             </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 transition-colors">{description}</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
               <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                  ))}
               </div>
               <span className="font-bold text-slate-900 dark:text-white transition-colors">{participation} ucenika</span> je glasalo
            </div>
            
            {isExpired && (
              <div className="flex gap-4 text-sm font-bold">
                <span className="text-emerald-600">ZA: {yesVotes}</span>
                <span className="text-rose-600">PROTIV: {noVotes}</span>
              </div>
            )}
          </div>
        </div>

        {!isExpired && (
          <VoteButtons 
            ruleId={ruleId} 
            isExpired={isExpired} 
            initialUserVote={currentUserVote} 
          />
        )}
      </div>
    </div>
  );
}
