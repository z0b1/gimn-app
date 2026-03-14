import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Settings as SettingsIcon, UserCog, Database, Bell, MessageSquare, Vote } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  const rules = await prisma.rule.findMany({ orderBy: { createdAt: "desc" } });
  const feedPosts = await prisma.gimnazijaFeedPost.findMany({ 
    include: { user: true },
    orderBy: { createdAt: "desc" } 
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-600">Upravljaj platformom i moderacijom sadržaja</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Navigation & Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 inline-flex items-center gap-2">
                  <Database size={18} className="text-indigo-600" />
                  Statistika sistema
                </h3>
                <div className="space-y-4">
                  <StatRow label="Vesti" value={news.length} />
                  <StatRow label="Predlozi" value={rules.length} />
                  <StatRow label="Feed Objave" value={feedPosts.length} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <SettingsCard 
                  icon={UserCog}
                  title="Korisnici"
                  link="/admin"
                />
                <SettingsCard 
                  icon={ShieldCheck}
                  title="Bezbednost"
                  link="/admin"
                />
              </div>
            </div>

            {/* Right Content - Moderation Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Moderation section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Moderacija sadržaja</h2>
                </div>

                {/* News Moderation */}
                <ModerationSection 
                  title="Najnovije vesti" 
                  icon={Bell} 
                  items={news.map(n => ({ id: n.id, title: n.title, sub: new Date(n.createdAt).toLocaleDateString(), type: 'news' }))} 
                />

                {/* Rules Moderation */}
                <ModerationSection 
                  title="Glasanja i pravila" 
                  icon={Vote} 
                  items={rules.map(r => ({ id: r.id, title: r.title, sub: r.status, type: 'rule' }))} 
                />

                {/* Feed Moderation */}
                <ModerationSection 
                  title="Gimnazija Feed" 
                  icon={MessageSquare} 
                  items={feedPosts.map(p => ({ 
                    id: p.id, 
                    title: p.content.substring(0, 50) + (p.content.length > 50 ? "..." : ""), 
                    sub: p.user.name || "Korisnik", 
                    type: 'feed' 
                  }))} 
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg">{value}</span>
    </div>
  );
}

interface ModerationItem {
  id: string;
  title: string;
  sub: string;
  type: "news" | "rule" | "feed";
}

function ModerationSection({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: ModerationItem[] }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
        <Icon size={20} className="text-indigo-600" />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="min-w-0 flex-1 mr-4">
              <h4 className="font-semibold text-slate-900 truncate">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
            </div>
            <DeleteButton id={item.id} type={item.type} />
          </div>
        )) : (
          <div className="p-12 text-center text-slate-400 text-sm">Nema sadržaja za prikaz.</div>
        )}
      </div>
    </div>
  );
}

// Client component for the delete button to handle the server action
import { DeleteButton } from "@/components/admin/DeleteButton";

function SettingsCard({ icon: Icon, title, link }: { icon: React.ElementType, title: string, link: string }) {
  return (
    <Link 
      href={link}
      className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
    </Link>
  );
}
