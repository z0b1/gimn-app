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
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 animate-fade-in">
                <ShieldCheck size={16} />
                <span>Zvanična platforma đačkog parlamenta</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
                Tvoj glas menja <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Gimnaziju</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Pridruži se đačkom parlamentu. Prati najnovije vesti, učestvuj u glasanju i 
                daj svoj doprinos unapređenju naše škole.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/gimnazija-feed"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                >
                  Pridruži se diskusiji
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/vesti"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Pročitaj vesti
                </Link>
              </div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-3xl opacity-50" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Bell}
                title="Vesti i Obaveštenja"
                description="Budi uvek u toku sa najvažnijim dešavanjima u školi. Brzo, tačno i pouzdano."
                color="bg-blue-500"
              />
              <FeatureCard 
                icon={Vote}
                title="Digitalno Glasanje"
                description="Tvoje mišljenje je važno. Glasaj za nove predloge i pravila direktno iz aplikacije."
                color="bg-indigo-500"
              />
              <FeatureCard 
                icon={MessageSquare}
                title="Gimnazija Feed"
                description="Mesto za tvoje ideje. Deli slike, video snimke i komuniciraj sa kolegama."
                color="bg-violet-500"
              />
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="py-20 border-t border-slate-100 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 text-center">
              <StatItem value={`${userCount.toLocaleString()}+`} label="Aktivnih učenika" />
              <StatItem value={`${ruleCount.toString()}+`} label="Usvojenih predloga" />
              <StatItem value="24/7" label="Dostupna podrška" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} GimnApp. Sva prava zadržana.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/pravila" className="hover:text-indigo-600">Pravila korišćenja</Link>
            <Link href="/privatnost" className="hover:text-indigo-600">Privatnost</Link>
          </div>
        </div>
      </footer>
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
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6", color)}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold text-indigo-600 mb-1">{value}</div>
      <div className="text-slate-500 font-medium">{label}</div>
    </div>
  );
}
