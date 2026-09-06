"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Search, Trash2, Upload } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteMediaItem } from "@/lib/actions/media";
import type { MediaItem } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  EmptyState,
  inputClass,
} from "@/components/admin/ui";

function kindLabel(kind: MediaItem["kind"]) {
  if (kind === "image") return "Imagen";
  if (kind === "video") return "Video";
  return "Documento";
}

function matchesSize(sizeBytes: number, filter: string) {
  if (filter === "all") return true;
  const b = sizeBytes || 0;
  const MB = 1024 * 1024;
  if (filter === "lt1") return b < MB;
  if (filter === "1to5") return b >= MB && b <= 5 * MB;
  if (filter === "5to20") return b > 5 * MB && b <= 20 * MB;
  if (filter === "gt20") return b > 20 * MB;
  return true;
}

export default function GaleriaAdminPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { items, loading, load } = useAdminList<MediaItem>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("media_items")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as MediaItem[];
  });

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((item) => {
      if (q) {
        const hay = [item.title, item.description, item.file_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (typeFilter !== "all" && item.kind !== typeFilter) return false;
      if (!matchesSize(item.size_bytes, sizeFilter)) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const ta = new Date(a.published_at).getTime();
      const tb = new Date(b.published_at).getTime();
      return sortOrder === "desc" ? tb - ta : ta - tb;
    });
  }, [items, query, sortOrder, sizeFilter, typeFilter]);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir archivo");
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    await load();
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar este recurso?")) return;
    await deleteMediaItem(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Galería de medios"
        subtitle="Sube fotos, documentos y videos. Los archivos se guardan directamente en tu almacenamiento."
        action={
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            Subir recursos
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {error && (
        <p className="mb-4 rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
          {error}
        </p>
      )}

      {/* Filtros */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o archivo…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
          className={inputClass}
        >
          <option value="desc">Fecha: Más recientes</option>
          <option value="asc">Fecha: Más antiguos</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={inputClass}
        >
          <option value="all">Tipo: Todos</option>
          <option value="image">Imagen</option>
          <option value="document">Documento</option>
          <option value="video">Video</option>
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className={inputClass}
        >
          <option value="all">Peso: Todos</option>
          <option value="lt1">Menos de 1 MB</option>
          <option value="1to5">1 – 5 MB</option>
          <option value="5to20">5 – 20 MB</option>
          <option value="gt20">Más de 20 MB</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="overflow-hidden rounded-xl border border-line bg-white"
            >
              <div className="relative aspect-[16/10] bg-primary-50">
                {m.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.file_url}
                    alt={m.title}
                    className="h-full w-full object-cover"
                  />
                ) : m.kind === "video" ? (
                  <video
                    src={m.file_url}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <FileText size={32} className="text-primary-300" />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-300">
                      {m.mime_type?.includes("pdf") ? "PDF" : "DOC"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary-800">
                    {m.title}
                  </p>
                  <p className="text-xs text-muted">
                    {kindLabel(m.kind)} · {formatBytes(m.size_bytes)} ·{" "}
                    {formatDate(m.published_at)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(m.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                  aria-label="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No hay recursos que coincidan." />
      )}
    </div>
  );
}
