"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const quickLinks = [
  { label: "Vacantes AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid" },
  { label: "Portal de Compras", href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid" },
  { label: "Circuito del Café", href: "/nuestro-trabajo/turismo" },
  { label: "Asociados y Aliados", href: "/nosotros/asociados-y-aliados" },
  { label: "Visión 2050", href: "/nuestro-trabajo/vision-2050" },
];

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/busqueda?q=${encodeURIComponent(q)}` : "/busqueda");
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 font-semibold text-slate-700 transition hover:text-accent-500"
      >
        <Search size={13} className="text-primary-600" />
        <span>Buscar</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/80 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={submit}
              className="flex items-center gap-3 border-b border-line p-4"
            >
              <Search size={20} className="shrink-0 text-primary-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en CECOM-RO (ej. AECID, Visión 2050, café)…"
                className="w-full text-sm text-ink outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-muted transition hover:text-ink"
                aria-label="Cerrar búsqueda"
              >
                <X size={20} />
              </button>
            </form>

            <div className="bg-surface p-4 text-xs text-muted">
              <span className="mb-2 block font-bold uppercase tracking-wider text-slate-400">
                Accesos rápidos:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded border border-line bg-white px-2.5 py-1 font-medium text-slate-600 transition hover:border-accent-400 hover:text-accent-500"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
