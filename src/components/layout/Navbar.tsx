"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Menu, X, Bell, Vote, MessageSquare, Plus, Info, Map as MapIcon, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const navLinks = [
  { href: "/vesti", label: "Vesti", icon: Bell },
  { href: "/glasanje", label: "Glasanje", icon: Vote },
  { href: "/gimnazija-feed", label: "Feed", icon: MessageSquare },
  { href: "/pitanja", label: "Pitanja", icon: HelpCircle },
  { href: "/o-nama", label: "O nama", icon: Info },
  { href: "/mapa", label: "Mapa", icon: MapIcon },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = (user?.publicMetadata as { role?: string })?.role === "ADMIN";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl text-slate-900 dark:text-white group shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform duration-300 shadow-sm shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="Šabačka gimnazija logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="tracking-tight truncate max-w-[120px] sm:max-w-none">GimnApp</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-accent transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <SignedIn>
              <NotificationCenter />
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-white transition-all shadow-sm"
                >
                  <Plus size={16} />
                  Objavi
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 border-2 border-slate-100 dark:border-slate-900",
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-brand-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-all shadow-sm">
                  Prijavi se
                </button>
              </SignInButton>
            </SignedOut>

            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in slide-in-from-top duration-300 transition-colors">
          <div className="space-y-1 p-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-3 text-base font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={20} className="text-brand-primary dark:text-brand-accent" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
