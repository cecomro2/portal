"use client";

import { useEffect, useState } from "react";
import { Check, FileText, Loader2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MediaPickerModal({
  open,
  kind,
  multiple = true,
  onClose,
  onSelect,
}: {
  open: boolean;
  kind: "image" | "document";
  multiple?: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSelected(new Set());
    const supabase = createBrowserSupabase();
    supabase
      .from("media_items")
      .select("*")
      .eq("kind", kind)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as MediaItem[]);
        setLoading(false);
      });
  }, [open, kind]);

  if (!open) return null;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (multiple) {
        next.add(id);
      } else {
        return new Set([id]);
      }
      return next;
    });
  }

  function confirm() {
    onSelect(items.filter((i) => selected.has(i.id)));
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-primary-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line bg-primary-600 px-5 py-4">
          <h3 className="text-base font-bold text-white">
            {kind === "image" ? "Elegir imágenes" : "Elegir documentos"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-primary-500"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {loading ? (
            <p className="flex items-center gap-2 py-8 text-sm text-muted">
              <Loader2 size={18} className="animate-spin" />
              Cargando galería…
            </p>
          ) : items.length ? (
            kind === "image" ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((m) => {
                  const isSel = selected.has(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggle(m.id)}
                      className={cn(
                        "relative overflow-hidden rounded-lg border bg-surface transition",
                        isSel
                          ? "border-primary-500 ring-2 ring-primary-300"
                          : "border-line hover:border-primary-300",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.file_url}
                        alt={m.title}
                        className="aspect-square w-full object-cover"
                      />
                      {isSel && (
                        <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((m) => {
                  const isSel = selected.has(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => toggle(m.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                          isSel
                            ? "border-primary-400 bg-primary-50"
                            : "border-line bg-white hover:border-primary-300",
                        )}
                      >
                        <FileText size={18} className="shrink-0 text-accent-500" />
                        <span className="min-w-0 flex-1 truncate text-sm text-ink">
                          {m.title}
                        </span>
                        {isSel && (
                          <Check size={16} className="shrink-0 text-primary-600" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              No hay elementos de este tipo en la galería.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-line p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={selected.size === 0}
            className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            Agregar seleccionados ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
