import { Navbar } from "@/components/layout/Navbar";
import { Landmark, MessageCircle, HelpCircle } from "lucide-react";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/roles";
import { AdminQuestionActions } from "@/components/qna/AdminQuestionActions";
import { QuestionForm } from "@/components/qna/QuestionForm";
import { QuestionReplies } from "@/components/qna/QuestionReplies";
import { UserQuestionActions } from "@/components/qna/UserQuestionActions";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function PitanjaPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      replies: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const user = await currentUser();
  const isUserAdmin = isAdmin();
  const dbUser = user
    ? await prisma.user.findUnique({ where: { clerkId: user.id } })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
            <HelpCircle size={20} />
            <span>Pitanja i Sugestije</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">
            Pitajte parlament
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">
            Imaš pitanje ili ideju? Pošalji nam direktno i pratite odgovore.
          </p>
        </header>

        <QuestionForm />

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 transition-colors">
            Sva pitanja
          </h3>
          {questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 sm:p-8 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold transition-colors">
                      {q.user.name?.[0] || "U"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white transition-colors">
                        {q.user.name}
                      </div>
                      <div className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                        {q.createdAt.toLocaleDateString("sr-RS")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {dbUser?.id === q.userId && !q.isResolved && (
                      <UserQuestionActions questionId={q.id} content={q.content} />
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        q.isResolved
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : q.answer
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {q.isResolved ? "REŠENO" : q.answer ? "ODGOVORENO" : "U OBRADI"}
                    </span>
                  </div>
                </div>

                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 transition-colors">
                  &quot;{q.content}&quot;
                </p>

                {q.answer ? (
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl p-6 border border-indigo-50 dark:border-indigo-900/50 mb-4 transition-colors">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-3">
                      <MessageCircle size={16} />
                      Odgovor parlamenta:
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic transition-colors">
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  !q.isResolved && (
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium mb-4 transition-colors">
                      <Landmark size={16} />
                      Čeka se odgovor...
                    </div>
                  )
                )}

                {isUserAdmin && !q.answer && !q.isResolved && (
                  <AdminQuestionActions questionId={q.id} content={q.content} />
                )}

                <QuestionReplies
                  questionId={q.id}
                  initialReplies={q.replies.map((r) => ({
                    id: r.id,
                    content: r.content,
                    createdAt: r.createdAt.toISOString(),
                    user: { name: r.user.name },
                  }))}
                  isCurrentUserAdmin={isUserAdmin}
                  isLoggedIn={!!dbUser}
                  isResolved={q.isResolved}
                />
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
              Još uvek nema postavljenih pitanja.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
