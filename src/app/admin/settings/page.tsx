import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Settings as SettingsIcon, UserCog, Database, Bell } from "lucide-react";
import Link from "next/link";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Podešavanja</h1>
              <p className="text-slate-600">Upravljaj parametrima sistema i platforme</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsCard 
              icon={UserCog}
              title="Upravljanje korisnicima"
              description="Pregledaj listu učenika i dodeli administratorske uloge."
              link="/admin"
            />
            <SettingsCard 
              icon={Bell}
              title="Obaveštenja"
              description="Konfiguriši automatska obaveštenja i push notifikacije."
              link="/admin"
            />
            <SettingsCard 
              icon={Database}
              title="Podaci sistema"
              description="Backup i pregled statistike korišćenja baze podataka."
              link="/admin"
            />
            <SettingsCard 
              icon={ShieldCheck}
              title="Bezbednost"
              description="Audit logovi i sigurnosna podešavanja platforme."
              link="/admin"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, link }: { icon: React.ElementType, title: string, description: string, link: string }) {
  return (
    <Link 
      href={link}
      className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
