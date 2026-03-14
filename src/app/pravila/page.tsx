import { Navbar } from "@/components/layout/Navbar";
import { Shield, FileText, Scale, UserCheck } from "lucide-react";
import Link from "next/link";

export default function PravilaPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors">Pravila korišćenja</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto transition-colors">
            Poslednje ažuriranje: {new Date().toLocaleDateString("sr-RS")}
          </p>
        </header>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none p-8 md:p-12 transition-colors prose prose-slate dark:prose-invert max-w-none">
          
          <div className="flex items-center gap-4 mb-4 mt-0">
             <FileText className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">1. Prihvatanje pravila</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Pristupanjem i korišćenjem GimnApp platforme, slažete se da ćete poštovati ova Pravila korišćenja. Platforma je namenjena isključivo učenicima Gimnazije za potrebe rada Đačkog parlamenta, informisanja i komunikacije.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
             <UserCheck className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">2. Korisnički nalozi i ponašanje</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Korisnici su obavezni da pri registraciji koriste svoje pravo ime i prezime. Zabranjeno je:
          </p>
          <ul className="text-slate-600 dark:text-slate-300">
            <li>Postavljanje uvredljivog, vulgarnog ili diskriminatornog sadržaja.</li>
            <li>Zloupotreba sistema za glasanje (pokušaji višestrukog glasanja, manipulacija rezultatima).</li>
            <li>Deljenje netačnih informacija i lažnih vesti unutar <strong>Gimnazija Feed-a</strong>.</li>
            <li>Lažno predstavljanje u ime administratora ili profesora.</li>
          </ul>

          <div className="flex items-center gap-4 mb-4 mt-12">
             <Shield className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">3. Moderacija Sadržaja</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Administratori (članovi parlamenta) zadržavaju pravo da obrišu svaki sadržaj (vesti, objave na feed-u, pitanja) koji krši ova pravila bez prethodnog upozorenja. U slučaju težih prekršaja, nalog korisnika može biti suspendovan.
          </p>

          <h2 className="text-2xl font-bold mt-12">4. Glasanje i Predlozi</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Sistem glasanja je autonoman. Predlozi imaju rok od 7 dana, nakon čega se automatski usvajaju ili odbijaju na osnovu glasova &quot;ZA&quot; i &quot;PROTIV&quot;. Odluka digitalnog parlamenta smatra se konačnom unutar okvira nadležnosti same aplikacije.
          </p>

          <h2 className="text-2xl font-bold mt-12">5. Izmene Pravila</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Zadržavamo pravo da u bilo kom trenutku izmenimo ova pravila. Vaša je odgovornost da redovno proveravate ovu stranicu kako biste bili upoznati sa promenama.
          </p>

        </article>
        
        <div className="text-center mt-12">
           <Link href="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
              &larr; Povratak na početnu stranu
           </Link>
        </div>
      </main>
    </div>
  );
}
