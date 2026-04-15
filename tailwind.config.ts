import type { Config } from "tailwindcss";
import { colors } from "./src/lib/colors";

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
        slate: colors.neutral,
        gray: colors.neutral,
        zinc: colors.neutral,
        neutral: colors.neutral,
        brand: {
          primary: colors.brand.primary,
          secondary: colors.brand.secondary,
          accent: colors.brand.accent,
        },
        semantic: colors.semantic,
      },
    },
  },
  plugins: [],
};
export default config;
