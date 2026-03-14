import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { srRS } from "@clerk/localizations";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "GimnApp - Učenički parlament",
  description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
  openGraph: {
    title: "GimnApp - Učenički parlament",
    description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
    type: "website",
    locale: "sr_RS",
    siteName: "GimnApp",
  },
  twitter: {
    card: "summary_large_image",
    title: "GimnApp - Učenički parlament",
    description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      localization={srRS as any}
    >

      <html lang="sr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
