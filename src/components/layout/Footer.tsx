import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">GimnApp</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Zvanična platforma Učeničkog parlamenta Šabačke gimnazije.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-500" />
                <span>Gospodar Jovanova 6, 15000 Šabac, Srbija</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-indigo-500" />
                <a href="tel:+38115350286" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  015 350286
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-indigo-500" />
                <a href="mailto:gimnazijasabac@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  gimnazijasabac@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links & Socials */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Linkovi</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <li>
                <Link href="/uslovi-koriscenja" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Uslovi Korišćenja
                </Link>
              </li>
              <li>
                <Link href="/privatnost" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Politika Privatnosti
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/people/%D0%A8%D0%B0%D0%B1%D0%B0%D1%87%D0%BA%D0%B0-%D0%B3%D0%B8%D0%BC%D0%BD%D0%B0%D0%B7%D0%B8%D1%98%D0%B0/100063767790129/?locale=sr_RS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/ucenicki_parlament_sg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-600">
          © {currentYear} GimnApp · Učenički parlament · Šabačka gimnazija
        </div>
      </div>
    </footer>
  );
}
