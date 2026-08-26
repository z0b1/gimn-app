import Link from "next/link";
import { FolderOpen, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AIChat } from "@/components/ai/AIChat";

const projects = [
  {
    href: "/hemija-26",
    title: "Hemija 26'",
    desc: "Takmičenje i projekat iz hemije.",
  },
  {
    href: "/humanitarni-sajam-knjiga",
    title: "Humanitarni sajam knjiga",
    desc: "Doniraj i razmeni polovne knjige.",
  },
];

export default function ProjektiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-brand-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary dark:text-brand-secondary">
              <FolderOpen size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Projekti
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Ideje, inicijative i projekti učenika Šabačke gimnazije. Ako ne znaš
            odakle da počneš, pitaj GimnApp AI u chatu ispod — može da ti pomogne
            oko plana, predloga za parlament i istraživanja.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {projects.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-brand-primary/50 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors"
              >
                <Lightbulb size={16} className="text-brand-primary dark:text-brand-secondary" />
                {p.title}
                <ArrowRight
                  size={14}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
              </Link>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-brand-primary dark:text-brand-secondary bg-brand-primary/10 dark:bg-brand-secondary/10 px-3 py-1.5 rounded-full">
            <Sparkles size={13} />
            Uključen GimnApp AI asistent
          </div>
        </div>
      </section>

      <AIChat initialGreeting="Zdravo! Ja sam GimnApp AI. Mogu da ti pomognem oko ideja za projekte, predloga za učenički parlament ili bilo kog školskog zadatka. Opiši mi šta planiraš ili na čemu već radiš?" />
    </div>
  );
}
