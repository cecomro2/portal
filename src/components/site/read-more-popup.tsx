"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function ReadMorePopup({
  title,
  paragraphs,
  buttonLabel = "Leer más",
}: {
  title: string;
  paragraphs: string[];
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        {buttonLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-primary-950/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line bg-primary-600 px-5 py-4">
              <h3 className="text-base font-bold text-white">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-primary-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
