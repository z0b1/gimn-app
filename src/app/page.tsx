import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Bell, Vote, MessageSquare, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [userCount, ruleCount] = await Promise.all([
    prisma.user.count(),
    prisma.rule.count(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
          {/* Softened hero background */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-[1.03] opacity-55 dark:opacity-45"
            style={{ backgroundImage: "url('/hero-banner.jpg')" }}
          />
          {/* Smooth vertical blend into page background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/82 to-white dark:from-slate-950/55 dark:via-slate-950/78 dark:to-slate-950 transition-colors duration-300" />
          {/* Gentle center focus to avoid harsh image edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_20%,rgba(255,255,255,0.55)_72%,rgba(255,255,255,0.92)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(2,6,23,0)_18%,rgba(2,6,23,0.5)_70%,rgba(2,6,23,0.9)_100%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-accent text-sm font-medium mb-6 animate-fade-in transition-colors">
                <ShieldCheck size={16} />
                <span>Zvanična platforma učeničkog parlamenta</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 sm:mb-8 transition-colors text-balance">
                Tvoj glas menja <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent dark:from-brand-accent dark:to-brand-primary">Gimnaziju</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto transition-colors">
                Pridruži se učeničkom parlamentu. Prati najnovije vesti, učestvuj u glasanju i 
                daj svoj doprinos unapređenju naše škole.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/gimnazija-feed"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold text-lg hover:bg-brand-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  Pridruži se diskusiji
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/vesti"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Pročitaj vesti
                </Link>
              </div>
              <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
                Prijavom koristiš Google/Clerk autentifikaciju. Pogledaj{" "}
                <Link href="/privatnost" className="font-semibold text-brand-primary dark:text-brand-accent hover:underline">
                  Politiku privatnosti
                </Link>{" "}
                i{" "}
                <Link href="/uslovi-koriscenja" className="font-semibold text-brand-primary dark:text-brand-accent hover:underline">
                  Uslove korišćenja
                </Link>
                .
              </div>
            </div>
          </div>
        </section>


        {/* Features Grid */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Bell}
                title="Vesti i Obaveštenja"
                description="Budi uvek u toku sa najvažnijim dešavanjima u školi. Brzo, tačno i pouzdano."
                color="bg-brand-secondary"
              />
              <FeatureCard 
                icon={Vote}
                title="Digitalno Glasanje"
                description="Tvoje mišljenje je važno. Glasaj za nove predloge i pravila direktno iz aplikacije."
                color="bg-brand-primary"
              />
              <FeatureCard 
                icon={MessageSquare}
                title="Gimnazija Feed"
                description="Mesto za tvoje ideje. Deli slike, video snimke i komuniciraj sa kolegama."
                color="bg-brand-accent"
              />
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="py-20 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-8 sm:gap-x-16 gap-y-10 text-center">
              <StatItem value={`${userCount.toLocaleString()}+`} label="Aktivnih učenika" />
              <StatItem value={`${ruleCount.toString()}+`} label="Usvojenih predloga" />
              <StatItem value="24/7" label="Dostupna podrška" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white mb-6", color)}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
        {description}
      </p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-brand-primary dark:text-brand-accent mb-1 transition-colors">{value}</div>
      <div className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{label}</div>
    </div>
  );
}
