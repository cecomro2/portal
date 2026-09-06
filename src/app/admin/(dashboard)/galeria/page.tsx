"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Trash2, Upload, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { createMediaItem, deleteMediaItem } from "@/lib/actions/media";
import type { MediaItem, MediaKind } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";

interface Pending {
  file_url: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
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

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<MediaKind>("image");
  const [pending, setPending] = useState<Pending | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPending({
        file_url: json.url,
        file_name: json.fileName,
        mime_type: json.mimeType,
        size_bytes: json.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir archivo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) {
      setError("Sube un archivo primero.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await createMediaItem({
      title,
      description,
      kind,
      file_url: pending.file_url,
      file_name: pending.file_name,
      mime_type: pending.mime_type,
      size_bytes: pending.size_bytes,
      published_at: new Date().toISOString(),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setOpen(false);
    setTitle("");
    setDescription("");
    setPending(null);
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
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Upload size={16} />
            Subir recurso
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">Subir recurso</h2>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Título *">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Tipo">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as MediaKind)}
                  className={inputClass}
                >
                  <option value="image">Imagen</option>
                  <option value="document">Documento</option>
                  <option value="video">Video</option>
                </select>
              </Field>
            </div>

            <Field label="Descripción">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Archivo *">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-600"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {pending ? "Cambiar archivo" : "Seleccionar archivo"}
                </button>
                {pending && (
                  <span className="flex items-center gap-2 text-sm text-ink">
                    <FileText size={15} className="text-accent-500" />
                    {pending.file_name} ({formatBytes(pending.size_bytes)})
                  </span>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFile}
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
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
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText size={36} className="text-primary-300" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary-800">
                    {m.title}
                  </p>
                  <p className="text-xs text-muted">
                    {m.kind} · {formatBytes(m.size_bytes)} ·{" "}
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
        <EmptyState message="No hay recursos. Sube el primero." />
      )}
    </div>
  );
}
