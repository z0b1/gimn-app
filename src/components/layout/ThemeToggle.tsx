"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
        {/* Placeholder for hydration */}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  );
}
