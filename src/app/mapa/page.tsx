import { Navbar } from "@/components/layout/Navbar";
import { Map as MapIcon, Compass, Info } from "lucide-react";

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-5xl text-center">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4">
            <MapIcon size={16} />
            <span>Mapa škole</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Gde se šta nalazi?</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 italic">
            Zgrada Šabačke gimnazije je u obliku nesimetričnog slova T.
          </p>
        </header>

        {/* Conceptual Map Visualization */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-12 mb-12 overflow-hidden mx-auto max-w-3xl min-h-[500px] flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            {/* T-Shape Building Layout (Conceptual) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center">
              {/* Horizontal bar of T */}
              <div className="w-full h-1/4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between px-8 relative border-2 border-indigo-500/20">
                <div className="text-xs font-bold text-slate-400">Levo krilo</div>
                <div className="text-xs font-bold text-indigo-500">Glavni ulaz</div>
                <div className="text-xs font-bold text-slate-400">Desno krilo</div>
              </div>
              {/* Vertical bar of T */}
              <div className="w-1/3 h-3/4 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-[-4px] border-2 border-indigo-500/20 flex flex-col items-center justify-around py-8">
                 <div className="text-xs font-bold text-slate-400">Kabineti</div>
                 <div className="text-xs font-bold text-slate-400">Laboratorije</div>
                 <div className="text-xs font-bold text-slate-400">Sala za fizičko</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 text-slate-400">
            <Compass size={16} />
            <span className="text-xs font-medium">Sever</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Prizemlje
            </h3>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Zbornica</li>
              <li>• Sekretarijat</li>
              <li>• Kabinet za računarstvo 1</li>
            </ul>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Prvi sprat
            </h3>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Biblioteka</li>
              <li>• Kabinet za biologiju</li>
              <li>• Svečana sala</li>
            </ul>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Drugi sprat
            </h3>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Kabinet za fiziku</li>
              <li>• Jezički kabineti</li>
              <li>• Kancelarija parlamenta</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl inline-flex items-center gap-3 text-indigo-700 dark:text-indigo-400 text-sm font-medium">
          <Info size={18} />
          <span>Napomena: Ovo je konceptualni prikaz. Zgrada se sastoji iz 10 kabineta i 14 učionica.</span>
        </div>
      </main>
    </div>
  );
}
