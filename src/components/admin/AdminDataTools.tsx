"use client";

import { useState } from "react";
import { purgeOldData, collectExportData } from "@/lib/actions/admin";
import { Download, Trash2, Loader2, AlertTriangle } from "lucide-react";

export function AdminDataTools() {
  const [isPurging, setIsPurging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

  const handlePurge = async () => {
    if (
      !confirm(
        "Ovo će trajno obrisati sve objave, pitanja i komentare starije od 1.5 godina. Jesi li siguran?"
      )
    )
      return;

    setIsPurging(true);
    setPurgeResult(null);
    try {
      const { deleted } = await purgeOldData();
      setPurgeResult(
        deleted > 0
          ? `✓ Obrisano ${deleted} starih zapisa.`
          : "✓ Nema podataka starijih od 1.5 godina."
      );
    } catch (err) {
      console.error(err);
      setPurgeResult("Greška pri brisanju podataka.");
    } finally {
      setIsPurging(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await collectExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gimn-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Greška pri izvozu podataka.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
      <h3 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">
        Upravljanje podacima
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
        Izvezi ili očisti korisničke sadržaje
      </p>

      <div className="space-y-3">
        {/* Export */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          Izvezi podatke (JSON)
        </button>

        {/* Purge */}
        <button
          onClick={handlePurge}
          disabled={isPurging}
          className="w-full flex items-center gap-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 px-4 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
        >
          {isPurging ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
          Obriši podatke starije od 1.5 god.
        </button>

        {purgeResult && (
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl ${
            purgeResult.startsWith("✓")
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
          }`}>
            {!purgeResult.startsWith("✓") && <AlertTriangle size={14} />}
            {purgeResult}
          </div>
        )}
      </div>
    </div>
  );
}
