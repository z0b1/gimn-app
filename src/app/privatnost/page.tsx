import { Navbar } from "@/components/layout/Navbar";
import { Lock, DatabaseBackup, Eye, UserCog } from "lucide-react";
import Link from "next/link";

export default function PrivatnostPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors">Politika Privatnosti</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto transition-colors">
            Poslednje ažuriranje: {new Date().toLocaleDateString("sr-RS")}
          </p>
        </header>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none p-8 md:p-12 transition-colors prose prose-slate dark:prose-invert max-w-none">
          
          <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
            Vaša privatnost nam je izuzetno važna. U ovoj Politici privatnosti objasnićemo koje podatke prikupljamo, kako ih koristimo i kako štitimo vašu privatnost unutar GimnApp ekosistema.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
             <DatabaseBackup className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">1. Podaci koje prikupljamo</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            GimnApp prikuplja sledeće vrste podataka kako bi omogućila osnovno funkcionisanje:
          </p>
          <ul className="text-slate-600 dark:text-slate-300">
            <li><strong>Osnovni profil:</strong> Ime, prezime i email adresa posredstvom Clerk autentifikacije.</li>
            <li><strong>Sadržaj:</strong> Objave, komentari, i pitanja koje postavite na feed-u ili u obliku pitanja za parlament.</li>
            <li><strong>Podaci o glasanju:</strong> Beležimo vaš glas na osnovu unikatnog ID-a kako bismo sprečili višestruko glasanje, međutim javni rezultati prikazuju isključivo agregate (ukupan zbir) bez isticanja vašeg imena.</li>
          </ul>

          <div className="flex items-center gap-4 mb-4 mt-12">
             <Eye className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">2. Kako koristimo podatke</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Generisani podaci se koriste isključivo za funkcionisanje aplikacije unutar Šabačke gimnazije. Identitet (Ime i Prezime) se prikazuje javno pored vaših objava na feed-u, kako bi diskusija ostala transparentna i kako bi se izbeglo anonimno uznemiravanje. Vaš email se koristi striktno u svrhe bezbedne prijave.
          </p>

          <div className="flex items-center gap-4 mb-4 mt-12">
             <UserCog className="text-indigo-600 dark:text-indigo-400" size={28} />
             <h2 className="m-0 text-2xl font-bold">3. Deljenje podataka</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            GimnApp <strong>ne prodaje</strong> i <strong>ne deli</strong> vaše podatke trećim licima. Podacima pristupaju:
          </p>
          <ul className="text-slate-600 dark:text-slate-300">
            <li><strong>Administratori:</strong> Isključivo u svrhu moderacije (uklanjanja neprikladnog sadržaja) i upravljanja ulogama (promocija u člana parlamenta).</li>
            <li><strong>Autentifikacioni partneri:</strong> Platforma &quot;Clerk&quot; se koristi isključivo kao naš provajder za bezbedno upravljanje pristupom i osetljivim informacijama poput lozinki.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12">4. Vaša prava</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Kao korisnik, u svakom trenutku možete zahtevati od administratora sistema da se vaše objave trajno uklone ili da se promeni prikaz vašeg imena ukoliko smatrate da se radi o grešci pri registraciji.
          </p>

        </article>
        
        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link href="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
              &larr; Povratak na početnu stranu
           </Link>
           <Link href="/uslovi-koriscenja" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
              Uslovi Korišćenja &rarr;
           </Link>
        </div>
      </main>
    </div>
  );
}
