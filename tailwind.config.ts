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
          primary: "#F35826", // Primary brand color (bright red-orange)
          secondary: "#F97373", // Secondary brand color (soft light red)
          accent: "#B91C1C",  // Action color (deep red for CTAs)
          muted: "#64748b",   // Muted slate for less emphasis
        },
      },
    },
  },
  plugins: [],
};
export default config;
