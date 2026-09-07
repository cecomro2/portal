"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Coffee,
  Compass,
  HelpCircle,
  Mail,
  Newspaper,
  ShoppingCart,
  X,
  type LucideIcon,
} from "lucide-react";

interface QuickOption {
  label: string;
  href: string;
  icon: LucideIcon;
}

const options: QuickOption[] = [
  { label: "Proyecto AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion", icon: Briefcase },
  { label: "Vacantes AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid", icon: Briefcase },
  { label: "Portal de Compras AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid", icon: ShoppingCart },
  { label: "Circuito del Café", href: "/nuestro-trabajo/turismo/circuito-del-cafe", icon: Coffee },
  { label: "Visión 2050", href: "/nuestro-trabajo/vision-2050", icon: Compass },
  { label: "Noticias", href: "/noticias", icon: Newspaper },
  { label: "Contacto", href: "/contacto", icon: Mail },
];

export function QuickHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante (izquierda) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar ayuda rápida" : "Abrir ayuda rápida"}
        className="fixed bottom-5 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition hover:scale-105 hover:bg-primary-700"
      >
        {open ? <X size={24} /> : <HelpCircle size={26} />}
      </button>

      {/* Ventana de ayuda rápida */}
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
            <div className="bg-primary-600 px-4 py-3.5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary-200">
                Ayuda rápida
              </p>
              <h2 className="text-base font-bold">¿Qué desea buscar?</h2>
            </div>

            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {options.map((o) => (
                <li key={o.href}>
                  <Link
                    href={o.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-surface hover:text-primary-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <o.icon size={16} />
                    </span>
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
