import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Plus, List, Settings, BarChart3, Users } from "lucide-react";
import { isAdmin, canManageNews } from "@/lib/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NewsFormModal } from "@/components/admin/NewsFormModal";
import { RuleFormModal } from "@/components/admin/RuleFormModal";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!canManageNews()) {
    redirect("/");
  }

  // Fetch real stats
  const [userCount, activeRulesCount, questionCount, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.rule.count({ where: { status: "ACTIVE" } }),
    prisma.question.count({ where: { answer: null } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  // Fetch recent activity (union of news and rules)
  const recentNews = await prisma.news.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const recentRules = await prisma.rule.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const activities = [
    ...recentNews.map(n => ({ id: n.id, type: 'NEWS', title: n.title, time: n.createdAt })),
    ...recentRules.map(r => ({ id: r.id, type: 'RULE', title: r.title, time: r.createdAt })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-accent dark:text-brand-secondary font-semibold mb-2">
              <ShieldCheck size={20} />
              <span>Administratorski Panel</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors">Upravljanje parlamentom</h1>
          </div>
          <div className="flex gap-3">
            <NewsFormModal 
              trigger={
                <button className="bg-brand-accent text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2">
                  <Plus size={18} />
                  Nova Objava
                </button>
              }
            />
            {isAdmin() && (
              <Link
                href="/admin/settings"
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <Settings size={18} />
                Podešavanja
              </Link>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {isAdmin() && (
             <>
               <AdminStatCard icon={Users} label="Ukupno učenika" value={userCount.toLocaleString()} change="Sistem" />
               <AdminStatCard icon={BarChart3} label="Aktivna glasanja" value={activeRulesCount.toString()} change="U toku" />
               <AdminStatCard icon={List} label="Nepročitana pitanja" value={questionCount.toString()} change="Čekaju odgovor" />
               <AdminStatCard icon={ShieldCheck} label="Moderatori" value={adminCount.toString()} change="Admin tim" />
             </>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Nedavne aktivnosti</h3>
                 <div className="space-y-6">
                    {activities.length > 0 ? activities.map((activity) => (
                      <ActivityItem 
                        key={activity.id}
                        user="Admin" 
                        action={activity.type === 'NEWS' ? "Objavio vest" : "Kreirao predlog"} 
                        target={activity.title} 
                        time={activity.time.toLocaleDateString("sr-RS")} 
                      />
                    )) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Nema nedavnih aktivnosti.</p>
                    )}
                 </div>
              </section>
           </div>
           
           <aside className="space-y-8">
              <section className="bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-100 p-8 text-white">
                 <h3 className="text-xl font-bold mb-4 text-brand-secondary">Brze akcije</h3>
                 <div className="space-y-3">
                    {isAdmin() && (
                      <>
                        <RuleFormModal trigger={<QuickActionButton label="Kreiraj glasanje" />} />
                        <QuickActionButton label="Dodaj administratora" />
                        <QuickActionButton label="Izvezi podatke" />
                      </>
                    )}
                 </div>
              </section>
           </aside>
        </div>
      </main>
    </div>
  );
}

interface AdminStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
}

function AdminStatCard({ icon: Icon, label, value, change }: AdminStatCardProps) {
   return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
         <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-accent/10 text-brand-accent dark:text-brand-secondary flex items-center justify-center mb-4 transition-colors">
            <Icon size={20} />
         </div>
         <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 transition-colors">{label}</div>
         <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{value}</div>
         <div className="text-xs font-bold text-brand-accent dark:text-brand-secondary uppercase tracking-wider transition-colors">{change}</div>
      </div>
   );
}

interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
}

function ActivityItem({ user, action, target, time }: ActivityItemProps) {
   return (
      <div className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors" />
            <div>
               <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                  {user} <span className="font-normal text-slate-500 dark:text-slate-400">{action}</span>
               </div>
               <div className="text-xs text-brand-accent dark:text-brand-secondary font-medium transition-colors">{target}</div>
            </div>
         </div>
         <div className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{time}</div>
      </div>
   );
}

function QuickActionButton({ label }: { label: string }) {
   return (
      <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left text-sm font-bold transition-all border border-white/5">
         {label}
      </button>
   );
}
