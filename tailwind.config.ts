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
          primary: "#DC2626", // Primary red (vibrant, confident)
          secondary: "#EF4444", // Secondary red (lighter, softer)
          accent: "#991B1B",  // Accent red (deep, rich for emphasis)
          muted: "#64748b",   // Muted slate for less emphasis
        },
      },
    },
  },
  plugins: [],
};
export default config;
