import { Navbar } from "@/components/layout/Navbar";
import { ScrollText, ShieldAlert, Ban, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function UsloviKoriscenjaPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <ScrollText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors">
            Uslovi Korišćenja
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto transition-colors">
            Poslednje ažuriranje: {new Date().toLocaleDateString("sr-RS")}
          </p>
        </header>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none p-8 md:p-12 transition-colors prose prose-slate dark:prose-invert max-w-none">

          <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
            Korišćenjem platforme GimnApp prihvatate ove Uslove korišćenja. Molimo vas da ih pažljivo pročitate pre nego što počnete da koristite aplikaciju.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
            <ScrollText className="text-indigo-600 dark:text-indigo-400" size={28} />
            <h2 className="m-0 text-2xl font-bold">1. O platformi</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            GimnApp je interna digitalna platforma Učeničkog parlamenta Šabačke gimnazije, namenjena isključivo učenicima i zaposlenima škole. Platforma omogućava praćenje vesti, glasanje o pravilima, postavljanje pitanja parlamentu i interakciju unutar zajednice.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
            <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={28} />
            <h2 className="m-0 text-2xl font-bold">2. Prihvatljivo korišćenje</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Korišćenjem GimnApp platforme obavezujete se da nećete:
          </p>
          <ul className="text-slate-600 dark:text-slate-300">
            <li>Objavljivati uvredljiv, uznemirujući ili neprikladan sadržaj.</li>
            <li>Zloupotrebljavati sistem glasanja ili pokušavati da ga zaobiđete.</li>
            <li>Lažno se predstavljati kao drugi korisnik ili administrator.</li>
            <li>Pokušavati da pristupite delovima sistema za koje nemate ovlašćenje.</li>
            <li>Objavljivati lične podatke trećih lica bez njihove saglasnosti.</li>
          </ul>

          <div className="flex items-center gap-4 mb-4 mt-12">
            <Ban className="text-indigo-600 dark:text-indigo-400" size={28} />
            <h2 className="m-0 text-2xl font-bold">3. Moderacija i sankcije</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Administratori sistema zadržavaju pravo da bez prethodnog upozorenja uklone sadržaj koji krši ova pravila, kao i da korisniku ograniče ili ukinu pristup platformi. Kršenje Uslova korišćenja može rezultirati prijavom nadležnim nastavnicima ili školskoj upravi, u skladu sa internim pravilnikom škole.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
            <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={28} />
            <h2 className="m-0 text-2xl font-bold">4. Izmene uslova</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Učenički parlament zadržava pravo da u bilo kom trenutku izmeni ove Uslove korišćenja. O svim značajnim izmenama korisnici će biti obavešteni putem obaveštenja na platformi. Nastavak korišćenja aplikacije nakon izmena smatra se prihvatanjem novih uslova.
          </p>

          <h2 className="text-2xl font-bold mt-12">5. Kontakt</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Ukoliko imate pitanja u vezi sa ovim Uslovima korišćenja, možete ih postaviti putem sekcije za pitanja na platformi ili se direktno obratiti administratorima parlamenta.
          </p>

        </article>

        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
            &larr; Povratak na početnu stranu
          </Link>
          <Link href="/privatnost" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
            Politika Privatnosti &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
