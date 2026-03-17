import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { srRS } from "@clerk/localizations";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: "GimnApp - Učenički parlament",
  description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
  metadataBase: new URL("https://gimnapp.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GimnApp - Učenički parlament",
    description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
    type: "website",
    locale: "sr_RS",
    siteName: "GimnApp",
    url: "https://gimnapp.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "GimnApp - Učenički parlament",
    description: "Zvanična aplikacija Učeničkog parlamenta Šabačke gimnazije.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
