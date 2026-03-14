"use client";

import { useState } from "react";
import { NewsForm } from "./NewsForm";

interface NewsFormModalProps {
  trigger: React.ReactNode;
}

export function NewsFormModal({ trigger }: NewsFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsOpen(false)}
          />
          <NewsForm
            onClose={() => setIsOpen(false)}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
