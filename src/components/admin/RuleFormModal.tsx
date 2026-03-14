"use client";

import { useState } from "react";
import { RuleForm } from "./RuleForm";

interface RuleFormModalProps {
  trigger: React.ReactNode;
}

export function RuleFormModal({ trigger }: RuleFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <RuleForm 
            onClose={() => setIsOpen(false)} 
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
