import { Navbar } from "@/components/layout/Navbar";
import { Info, Users, Award } from "lucide-react";

export default function ONamaPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary font-bold text-sm mb-4">
            <Info size={16} />
            <span>O nama</span>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Učenički parlament <br />
            <span className="text-brand-primary dark:text-brand-secondary">Šabačke gimnazije</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mi smo glas učenika, pokretači promena i organizatori školskog života. 
            Saznajte više o našem radu, istoriji i viziji.
          </p>
        </header>

        <div className="space-y-12 mb-16">
          {/* Uvod */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Users className="text-brand-primary" />
              Šta je Učenički parlament?
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                Učenički parlament je zakonom zagarantovana formalna institucija, koja učenicima omogućava demokratski način udruživanja radi zastupanja interesa svih učenika u školi, kao i učešće učenika u donošenju odluka koje se njih neposredno tiču.
              </p>
              <p>
                Parlament čine po dva predstavnika svakog odeljenja u školi. Članove parlamenta biraju učenici odeljenjske zajednice svake školske godine, a članovi parlamenta biraju predsednika. Program rada parlamenta sastavni je deo Godišnjeg plana rada škole.
              </p>
            </div>
          </section>

          {/* Ciljevi */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-8 rounded-3xl border border-brand-primary/20 dark:border-brand-primary/20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Učenički parlament se organizuje radi:</h3>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                {[
                  "Davanja mišljenja i predloga stručnim organima o pravilima ponašanja, bezbednosti, projektima i manifestacijama.",
                  "Razmatranja odnosa i saradnje učenika i nastavnika i atmosfere u školi.",
                  "Obaveštavanja učenika o pitanjima od posebnog značaja za školovanje.",
                  "Aktivnog učešća u procesu planiranja razvoja škole.",
                  "Predlaganja članova Stručnog aktiva za razvojno planiranje iz reda učenika."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="text-brand-accent" />
                Rukovodstvo parlamenta
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Predsednik</span>
                  <span className="font-bold text-slate-900 dark:text-white">Nemanja Filipović</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Zamenik predsednika</span>
                  <span className="font-bold text-slate-900 dark:text-white">Lenka Mijailović</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Sekretar</span>
                  <span className="font-bold text-slate-900 dark:text-white">Teodora Marović</span>
                </div>
                <div className="p-4 border border-brand-primary/20 dark:border-brand-primary/20 rounded-2xl">
                  <span className="text-xs text-brand-primary dark:text-brand-secondary font-bold uppercase block mb-1">Predstavnici u Školskom odboru</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Isidora Živanović, Sergej Babić</span>
                </div>
              </div>
            </div>
          </section>

          {/* Clanovi po odeljenjima */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Članovi Učeničkog parlamenta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { class: "I-1", names: "Petar Peranović, Tijana Mirković" },
                { class: "I-2", names: "Andrea Srećković, Luka Milovanović" },
                { class: "I-3", names: "Vasilije Petrović, Lenka Todorović" },
                { class: "I-4", names: "Dunja Tufegdžić, Vanja Erski" },
                { class: "I-5", names: "Tara Ilić, Anđelija Mijailović" },
                { class: "I-6", names: "Lena Milišić, Božidar Mišković" },
                { class: "I-7", names: "Helena Šajić, Tijana Stipetić" },
                { class: "II-1", names: "Ljubica Jovanović, Andrijana Ninković" },
                { class: "II-2", names: "Staša Radović, Emilija Petrović" },
                { class: "II-3", names: "U obradi" },
                { class: "II-4", names: "Maša Krstić, Andrea Đurković" },
                { class: "II-5", names: "Vanja Milić, Petra Sandić" },
                { class: "II-6", names: "Vuk Prstojević, Lazar Nikić" },
                { class: "II-7", names: "Mila Živanović, Anka Ristić" },
                { class: "III-1", names: "Anđela Pantović-Ćirić, Dunja Stepanović" },
                { class: "III-2", names: "Sara Vraštanović, Teodora Petrović" },
                { class: "III-3", names: "Lea Topalović, Uroš Obradinović" },
                { class: "III-4", names: "Danilo Makević, Anja Dimitrijević" },
                { class: "III-5", names: "Anastasija Kovačević, Selena Pejić" },
                { class: "III-6", names: "Aleksandar Nikolić, Boris Radovanović" },
                { class: "III-7", names: "Anastasija Gišić, Dušan Babić" },
                { class: "IV-1", names: "Nemanja Filipović, Isidora Živanović" },
                { class: "IV-2", names: "Sergej Babić, Mia Isailović" },
                { class: "IV-3", names: "Dijana Ivanović, Teodora Marović" },
                { class: "IV-4", names: "Mia Đurđević, Aleksandra Mićić" },
                { class: "IV-5", names: "Milica Popović, Lenka Mijailović" },
                { class: "IV-6", names: "Jana Ilić, Dimitrije Josipović" },
                { class: "IV-7", names: "Anđela Kukolj, Anđela Stevanović" },
              ].map((item) => (
                <div key={item.class} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                  <div className="text-xs font-bold text-brand-primary dark:text-brand-secondary mb-1">{item.class}</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">{item.names}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Kontakt */}
          <section className="bg-brand-primary rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden">
            <h2 className="text-3xl font-bold mb-4">Kontaktiraj nas</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Imaš pitanje, predlog ili želiš da se uključiš u rad parlamenta? Piši nam na našu zvaničnu email adresu.
            </p>
            <a 
              href="mailto:parlamentucenickiparlament@gmail.com"
              className="inline-flex items-center gap-3 bg-white text-slate-900 px-4 sm:px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl shadow-brand-primary/20 max-w-full"
            >
              <span className="text-base sm:text-lg break-all">parlamentucenickiparlament@gmail.com</span>
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
