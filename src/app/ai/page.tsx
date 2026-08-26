"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Home } from "lucide-react";
import { AIChat } from "@/components/ai/AIChat";

export default function AIPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [homeUrl, setHomeUrl] = useState("/");

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    if (host.startsWith("ai.")) {
      setHomeUrl(`${window.location.protocol}//${host.slice(3)}`);
    } else {
      setHomeUrl("/");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href={homeUrl}
              className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl text-slate-900 dark:text-white group shrink-0"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="tracking-tight">GimnApp</span>
              <span className="text-sm font-normal text-brand-primary dark:text-brand-secondary ml-1">
                AI
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={homeUrl}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Home size={18} />
                Početna
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <Link
              href={homeUrl}
              className="flex items-center gap-3 px-3 py-3 w-full text-base font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <Home size={20} className="text-brand-primary dark:text-brand-accent" />
              Početna
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-3 px-3 py-3 w-full text-base font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-brand-primary dark:text-brand-accent" />
                ) : (
                  <Moon size={20} className="text-brand-primary dark:text-brand-accent" />
                )}
                {theme === "dark" ? "Svetli režim" : "Tamni režim"}
              </button>
            )}
          </div>
        )}
      </nav>

      <AIChat />
    </div>
  );
}
