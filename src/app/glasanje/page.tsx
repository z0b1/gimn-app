import { Navbar } from "@/components/layout/Navbar";
import { Vote, ChevronRight, Info, CheckCircle2, History } from "lucide-react";

export default function GlasanjePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
              <Vote size={20} />
              <span>Digitalno Glasanje</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Aktuelni predlozi</h1>
            <p className="text-slate-500 mt-2">Učestvuj u donošenju odluka koje se tiču svih nas.</p>
          </div>
          <button className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-6 py-3 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md transition-all">
            <History size={18} />
            Arhiva glasanja
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <VoteCard 
            title="Novi kodeks oblačenja za maturante"
            description="Predlog za uvođenje posebnih pravila oblačenja petkom za učenike četvrte godine, uključujući mogućnost nošenja odeće sa obeležjima škole."
            timeLeft="Još 2 dana"
            participation="420"
          />
          <VoteCard 
            title="Produženje velikog odmora za 5 minuta"
            description="Inicijativa da se veliki odmor produži radi lakšeg pristupa užini, uz skraćenje malih odmora između drugog i trećeg časa."
            timeLeft="Još 5 sati"
            participation="892"
          />
        </div>

        <section className="mt-16 bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-3xl font-bold mb-4">Imaš svoj predlog?</h2>
                 <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                    Svaki učenik ima pravo da predloži promenu. Prikupi 50 potpisa podrške i tvoj predlog će se naći na glasanju.
                 </p>
                 <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl flex items-center gap-3 group">
                    Kompletno uputstvo
                    <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
              <div className="hidden lg:block w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -right-20 -bottom-20" />
              <div className="hidden lg:block w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl absolute -left-40 -top-40" />
           </div>
        </section>
      </main>
    </div>
  );
}

interface VoteCardProps {
  title: string;
  description: string;
  timeLeft: string;
  participation: string;
}

function VoteCard({ title, description, timeLeft, participation }: VoteCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Aktivno
             </span>
             <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                <Info size={14} />
                {timeLeft}
             </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 leading-relaxed mb-8">{description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
             <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                   <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
             </div>
             <span className="font-bold text-slate-900">{participation} ucenika</span> je već glasalo
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
           <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Glasaj ZA
           </button>
           <button className="w-full bg-white text-slate-900 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Glasaj PROTIV
           </button>
        </div>
      </div>
    </div>
  );
}
