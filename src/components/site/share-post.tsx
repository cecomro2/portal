"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { getShareLinks } from "@/lib/share-links";

export function SharePost({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus({ preventScroll: true });
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    function moved() { setOpen(false); }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", moved);
    window.addEventListener("scroll", moved, { passive: true });
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); window.removeEventListener("resize", moved); window.removeEventListener("scroll", moved); };
  }, [open]);

  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage("Enlace copiado."); }
    catch { setMessage("No se pudo copiar automáticamente. Selecciona y copia el enlace de abajo."); }
  }

  return <div ref={root} className="relative">
    <button ref={trigger} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => {
      const rect = trigger.current?.getBoundingClientRect();
      if (rect) setPosition({ left: Math.max(16, Math.min(rect.left, window.innerWidth - 272)), top: Math.max(16, Math.min(rect.bottom + 8, window.innerHeight - 440)) });
      setOpen(!open); setMessage("");
    }} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
      <Share2 size={15} aria-hidden="true" />Compartir
    </button>
    {open && <div id={panelId} role="group" aria-label="Opciones para compartir" style={{ left: position.left, top: position.top, maxHeight: `calc(100dvh - ${position.top + 16}px)` }} className="fixed z-50 w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-line bg-white p-3 text-sm shadow-xl" onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !root.current?.contains(event.relatedTarget)) setOpen(false);
    }}>
      <p className="mb-2 px-2 font-semibold text-primary-800">Compartir publicación</p>
      {getShareLinks(url, title).map((link, index) => <a key={link.name} ref={index === 0 ? firstLink : undefined} href={link.href} target={link.href.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center justify-between rounded-lg px-2 py-2 text-ink transition hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-600">
        {link.name}<ExternalLink size={13} aria-hidden="true" />
      </a>)}
      <button type="button" onClick={copy} className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-line px-2 py-2 text-left font-medium text-primary-700 hover:bg-primary-50"><Copy size={14} aria-hidden="true" />Copiar enlace</button>
      <label className="mt-2 block text-xs text-muted">Enlace de la publicación<input readOnly value={url} onFocus={(event) => event.target.select()} className="mt-1 w-full rounded border border-line px-2 py-1.5 text-xs text-ink" /></label>
      <p role="status" className="mt-2 text-xs text-primary-700">{message}</p>
    </div>}
  </div>;
}
