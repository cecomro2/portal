"use client";

import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";

export interface DocItem {
  id: string;
  label: string;
  file_url: string;
}

export function DocumentList({ documents }: { documents: DocItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!documents.length) return null;

  return (
    <ul className="space-y-3">
      {documents.map((doc) => {
        const open = openId === doc.id;
        return (
          <li
            key={doc.id}
            className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-primary-300"
          >
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
                  <FileText size={20} />
                </span>
                <span className="pt-1 text-sm font-semibold text-slate-900 sm:text-base">
                  {doc.label}
                </span>
              </span>
              <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700 md:hidden"
                >
                  <Eye size={15} />
                  Ver Documento (PDF)
                </a>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : doc.id)}
                  className="hidden items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700 md:inline-flex"
                >
                  <Eye size={15} />
                  {open ? "Ocultar" : "Ver Documento (PDF)"}
                </button>
                <a
                  href={`/api/download?url=${encodeURIComponent(doc.file_url)}&name=${encodeURIComponent(doc.label + ".pdf")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2.5 text-xs font-semibold text-primary-700 transition hover:border-primary-300"
                >
                  <Download size={15} />
                </a>
              </div>
            </div>

            {open && (
              <div className="hidden border-t border-line bg-white md:block">
                <iframe
                  src={doc.file_url}
                  title={doc.label}
                  className="h-[70vh] w-full"
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
