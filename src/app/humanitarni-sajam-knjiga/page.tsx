import { Navbar } from "@/components/layout/Navbar";
import { Book, Heart, Calendar, MapPin } from "lucide-react";

export default function HumanitarniSajamPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary font-bold text-sm mb-4">
            <Heart size={16} />
            <span>Humanitarni projekat</span>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Humanitarni sajam knjiga
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium italic">
            &bdquo;Knjige, braćo, knjige&rdquo;
          </p>
        </header>

        <div className="space-y-12 mb-16">
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Book className="text-brand-primary" />
              O projektu
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                Humanitarni sajam knjiga je projekat Učeničkog parlamenta Šabačke gimnazije 
                koji za cilj ima prikupljanje sredstava za pomoć učenicima i promociju 
                kulture čitanja među mladima.
              </p>
              <p>
                Kroz ovaj projekat, učenici mogu da doniraju polovne knjige koje se 
                potom prodaju po simboličnim cenama, a sav prihod ide u humanitarne svrhe.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Calendar className="text-brand-primary mb-4" size={32} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Kada?</h3>
              <p className="text-slate-600 dark:text-slate-400">U toku školske godine. Pratite obaveštenja za tačne datume.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <MapPin className="text-brand-primary mb-4" size={32} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Gde?</h3>
              <p className="text-slate-600 dark:text-slate-400">Hol Šabačke gimnazije, Masarikova 13.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Heart className="text-brand-primary mb-4" size={32} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Kako učestvovati?</h3>
              <p className="text-slate-600 dark:text-slate-400">Doniraj knjige, kupi knjigu ili se prijavi kao volonter.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
