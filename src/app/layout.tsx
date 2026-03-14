import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { srRS } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Gimn App - Đački parlament",
  description: "Aplikacija đačkog parlamenta za vesti, pravila i glasanje.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={srRS as any}>
      <html lang="sr">
        <body className={inter.className}>
          <main className="min-h-screen bg-slate-50 text-slate-900">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
