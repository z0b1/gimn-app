import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#F35826", // Primary brand color
          secondary: "#F7BD11", // Secondary brand color
          accent: "#3b82f6",  // Brighter blue for highlights
          muted: "#64748b",   // Muted slate for less emphasis
        },
      },
    },
  },
  plugins: [],
};
export default config;
