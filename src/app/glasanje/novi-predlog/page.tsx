import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft, Lightbulb, Send } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function NoviPredlogPage() {
  const { userId } = auth();
  if (!userId) redirect("/");

  const submitProposal = async (formData: FormData) => {
    "use server";
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const content = formData.get("content")?.toString();
    const title = formData.get("title")?.toString();

    if (!content || !title) return;

    // We fetch the internal user id since `userId` here is Clerk's ID.
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error("User not found");

    // We use the Question model as a generic submission/inbox for the admins to review.
    // We prepend [PREDLOG] so admins know what it is.
    await prisma.question.create({
      data: {
        content: `[PREDLOG: ${title}]\n\n${content}`,
        userId: user.id,
      }
    });

    revalidatePath("/admin");
    redirect("/pitanja"); // Redirect them to Q&A where they can see their submission 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link 
          href="/glasanje" 
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Nazad na glasanje
        </Link>

        <header className="mb-10 text-center">
          <div className="w-16 h-16 bg-brand-secondary/20 dark:bg-brand-accent/30 text-brand-primary dark:text-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <Lightbulb size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Predloži promenu</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
            Da li imate ideju koja može da unapredi našu školu? Opišite vaš predlog, 
            a đački parlament će ga razmotriti i potencijalno staviti na zvanično glasanje.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 dark:bg-brand-accent/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center font-bold mx-auto mb-3">1</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Ideja</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Smisli i jasno opisi promenu koju želiš da vidiš.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 dark:bg-brand-accent/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center font-bold mx-auto mb-3">2</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Podrška</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Parlament razmatra predlog i proverava interesovanje.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 dark:bg-brand-accent/20 text-brand-primary dark:text-brand-secondary flex items-center justify-center font-bold mx-auto mb-3">3</div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Glasanje</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ako je odobreno, predlog ide na digitalno glasanje.</p>
          </div>
        </div>

        <form action={submitProposal} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-brand-primary/10 dark:shadow-none">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Naslov predloga</label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="Npr. Duži veliki odmor za 5 minuta"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border-none rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-secondary/30 dark:focus:ring-brand-accent/30 transition-colors"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Detaljan opis</label>
            <textarea 
              name="content"
              required
              placeholder="Objasnite zašto je ovaj predlog bitan, kako bi se sproveo i koje bi prednosti doneo učenicima..."
              className="w-full bg-slate-50 dark:bg-slate-950/50 border-none rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-secondary/30 dark:focus:ring-brand-accent/30 min-h-[200px] resize-y transition-colors"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Budite što jasniji i konkretniji kako bi parlament mogao lakše da donese odluku.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20 dark:shadow-none flex items-center justify-center gap-3 group"
          >
            <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            Pošalji predlog parlamentu
          </button>
        </form>
      </main>
    </div>
  );
}
