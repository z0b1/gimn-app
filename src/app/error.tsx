"use client";

import { useEffect } from "react";
import { Landmark, RefreshCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { reportError } from "@/lib/actions/error-reporting";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error locally
    console.error(error);

    // Report error via email
    const reportToAdmin = async () => {
      await reportError({
        message: error.message || "Unknown error",
        digest: error.digest,
        url: window.location.href,
        timestamp: new Date().toLocaleString("sr-RS"),
      });
    };

    reportToAdmin();
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 mx-auto mb-8 animate-pulse">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Ups! Došlo je do greške</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Pojavio se problem prilikom učitavanja ove stranice. Naš tim je obavešten.
        </p>

        {error.digest && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Error Digest ID</p>
            <code className="text-sm font-mono text-indigo-600 break-all select-all">
              {error.digest}
            </code>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
          >
            <RefreshCcw size={20} className="group-active:rotate-180 transition-transform duration-500" />
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            className="w-full bg-white text-slate-900 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            Vrati se na početnu
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-400 font-medium">
        <Landmark size={18} />
        <span>GimnApp Support</span>
      </div>
    </div>
  );
}
