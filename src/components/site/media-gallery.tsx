"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Search,
  X,
} from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";

function matchesDate(item: MediaItem, filter: string) {
  if (filter === "all") return true;
  const d = new Date(item.published_at).getTime();
  const now = Date.now();
  const day = 86_400_000;
  if (filter === "30d") return now - d <= 30 * day;
  if (filter === "90d") return now - d <= 90 * day;
  if (filter === "1y") return now - d <= 365 * day;
  return true;
}

function matchesSize(item: MediaItem, filter: string) {
  if (filter === "all") return true;
  const b = item.size_bytes || 0;
  const MB = 1024 * 1024;
  if (filter === "lt1") return b < MB;
  if (filter === "1to5") return b >= MB && b <= 5 * MB;
  if (filter === "5to20") return b > 5 * MB && b <= 20 * MB;
  if (filter === "gt20") return b > 20 * MB;
  return true;
}

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (q) {
        const hay = [item.title, item.description, item.file_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (!matchesDate(item, dateFilter)) return false;
      if (!matchesSize(item, sizeFilter)) return false;
      return true;
    });
  }, [items, query, dateFilter, sizeFilter]);

  return (
    <div>
      {/* Filtros */}
      <div className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, descripción o archivo…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary-400"
        >
          <option value="all">Fecha: Todas</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 3 meses</option>
          <option value="1y">Último año</option>
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary-400"
        >
          <option value="all">Tamaño: Todos</option>
          <option value="lt1">Menos de 1 MB</option>
          <option value="1to5">1 – 5 MB</option>
          <option value="5to20">5 – 20 MB</option>
          <option value="gt20">Más de 20 MB</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">
        {filtered.length} resultado{filtered.length !== 1 && "s"}
      </p>

      {/* Grid */}
      {filtered.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {item.kind === "image" ? (
                <button
                  type="button"
                  onClick={() => setLightbox(item)}
                  className="relative block aspect-[16/11] w-full overflow-hidden bg-primary-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-primary-950/0 opacity-0 transition group-hover:bg-primary-950/20 group-hover:opacity-100">
                    <Eye size={22} className="text-white" />
                  </span>
                </button>
              ) : item.kind === "video" ? (
                <div className="aspect-[16/11] w-full bg-primary-950">
                  <video
                    src={item.file_url}
                    controls
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/11] w-full items-center justify-center bg-primary-50">
                  <FileText size={40} className="text-primary-300" />
                </div>
              )}

              <div className="p-4">
                <h3 className="truncate text-sm font-semibold text-primary-800">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>{formatDate(item.published_at)}</span>
                  <span>{formatBytes(item.size_bytes)}</span>
                </div>

                {item.kind !== "image" && (
                  <div className="mt-3 flex gap-2">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-primary-700 transition hover:border-primary-300"
                    >
                      <Eye size={14} />
                      Ver
                    </a>
                    <a
                      href={`/api/download?url=${encodeURIComponent(item.file_url)}&name=${encodeURIComponent(item.file_name)}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700"
                    >
                      <Download size={14} />
                      Descargar
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
          No se encontraron recursos con los filtros seleccionados.
        </p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-950/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-h-[90vh] max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.file_url}
              alt={lightbox.title}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm text-white">
              {lightbox.title}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Cerrar"
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-lg transition hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
