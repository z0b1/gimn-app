import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Plus, List, Settings, BarChart3, Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
              <ShieldCheck size={20} />
              <span>Administratorski Panel</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Upravljanje parlamentom</h1>
          </div>
          <div className="flex gap-3">
             <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                <Plus size={18} />
                Nova Objava
             </button>
             <button className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                <Settings size={18} />
                Podešavanja
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <AdminStatCard icon={Users} label="Ukupno učenika" value="1,245" change="+12 ovog meseca" />
           <AdminStatCard icon={BarChart3} label="Aktivna glasanja" value="4" change="2 završena nedavno" />
           <AdminStatCard icon={List} label="Nepročitana pitanja" value="12" change="8 hitnih" />
           <AdminStatCard icon={ShieldCheck} label="Moderatori" value="8" change="Admin tim" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                 <h3 className="text-xl font-bold mb-6">Nedavne aktivnosti</h3>
                 <div className="space-y-6">
                    <ActivityItem 
                       user="Marko J." 
                       action="Objavio novu vest" 
                       target="Sportski turnir 2026" 
                       time="pre 2h" 
                    />
                    <ActivityItem 
                       user="Sistem" 
                       action="Glasanje završeno" 
                       target="Novi dresovi" 
                       time="pre 5h" 
                    />
                    <ActivityItem 
                       user="Jovana K." 
                       action="Odgovorila na pitanje" 
                       target="Fizika kabinet" 
                       time="pre 1 dan" 
                    />
                 </div>
              </section>
           </div>
           
           <aside className="space-y-8">
              <section className="bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-100 p-8 text-white">
                 <h3 className="text-xl font-bold mb-4 text-indigo-100">Brze akcije</h3>
                 <div className="space-y-3">
                    <QuickActionButton label="Kreiraj glasanje" />
                    <QuickActionButton label="Dodaj administratora" />
                    <QuickActionButton label="Izvez podatke" />
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
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Icon size={20} />
         </div>
         <div className="text-slate-500 text-sm font-medium mb-1">{label}</div>
         <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
         <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{change}</div>
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
      <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
            <div>
               <div className="text-sm font-bold text-slate-900">
                  {user} <span className="font-normal text-slate-500">{action}</span>
               </div>
               <div className="text-xs text-indigo-600 font-medium">{target}</div>
            </div>
         </div>
         <div className="text-xs text-slate-400">{time}</div>
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
