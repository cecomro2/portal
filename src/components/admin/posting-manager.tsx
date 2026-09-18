"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deletePosting, savePosting } from "@/lib/actions/postings";
import type { Posting, PostingType } from "@/lib/types";
import { formatDate, postingStatus } from "@/lib/utils";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { FileUpload, type UploadedFile } from "@/components/admin/file-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { PillsInput } from "@/components/admin/pills-input";

interface FormState {
  title: string;
  description: string;
  apply_info: string;
  closing_date: string;
  published_at: string;
  status: "open" | "closed" | "none";
  files: UploadedFile[];
  images: string[];
  locations: string[];
  apply_emails: string[];
}

const empty: FormState = {
  title: "",
  description: "",
  apply_info: "",
  closing_date: "",
  published_at: "",
  status: "open",
  files: [],
  images: [],
  locations: [],
  apply_emails: [],
};

export function PostingManager({
  type,
  title,
  subtitle,
}: {
  type: PostingType;
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  const { items, loading, load } = useAdminList<Posting>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("postings")
      .select("*")
      .eq("type", type)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    return (data ?? []) as Posting[];
  });

  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Posting | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("locations")
      .select("name")
      .order("name")
      .then(({ data }) => setLocationOptions((data ?? []).map((l) => l.name)));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const hay = `${p.title} ${p.description} ${p.location ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (dateFilter !== "all") {
        const d = new Date(p.published_at ?? p.created_at).getTime();
        const day = 86_400_000;
        const days =
          dateFilter === "30d" ? 30 : dateFilter === "90d" ? 90 : 365;
        if (Date.now() - d > days * day) return false;
      }
      return true;
    });
  }, [items, query, dateFilter]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing(null);
    setForm({
      ...empty,
      published_at: new Date().toISOString().slice(0, 10),
    });
    setError("");
    setOpen(true);
  }

  async function openEdit(p: Posting) {
    const supabase = createBrowserSupabase();
    const [{ data: files }, { data: imgs }] = await Promise.all([
      supabase
        .from("posting_files")
        .select("*")
        .eq("posting_id", p.id)
        .order("sort_order"),
      supabase
        .from("posting_images")
        .select("image_url")
        .eq("posting_id", p.id)
        .order("sort_order"),
    ]);
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? "",
      apply_info: p.apply_info ?? "",
      closing_date: p.closing_date ?? "",
      published_at: p.published_at ?? "",
      status:
        p.status === "open" || p.status === "closed" || p.status === "none"
          ? p.status
          : p.is_active
            ? "open"
            : "closed",
      files: (files ?? []).map((f) => ({
        file_name: f.file_name,
        file_url: f.file_url,
        mime_type: f.mime_type,
      })),
      images: (imgs ?? []).map((i) => i.image_url),
      locations: p.locations ?? [],
      apply_emails: p.apply_emails ?? [],
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await savePosting({
      id: editing?.id,
      type,
      title: form.title,
      description: form.description,
      apply_info: form.apply_info,
      closing_date: form.closing_date || null,
      location: form.locations[0] ?? "",
      locations: form.locations,
      apply_emails: form.apply_emails,
      published_at: form.published_at || null,
      status: form.status,
      files: form.files,
      images: form.images.map((url) => ({ image_url: url })),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setOpen(false);
    await load();
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar este registro?")) return;
    await deletePosting(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Nuevo
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar registro" : "Nuevo registro"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Título *">
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Descripción (texto enriquecido)">
              <RichTextEditor
                value={form.description}
                onChange={(html) => set("description", html)}
              />
            </Field>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Fecha de publicación" hint="Controla el orden en la lista (por defecto, hoy).">
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => set("published_at", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Fecha de cierre" hint="Al llegar esta fecha, el estado cambiará a cerrado.">
                <input
                  type="date"
                  value={form.closing_date}
                  onChange={(e) => set("closing_date", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Información para aplicar" hint="Solo se mostrará mientras esté abierta.">
                <textarea
                  rows={3}
                  value={form.apply_info}
                  onChange={(e) => set("apply_info", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Ubicaciones" hint="Una o más ubicaciones; aparecen como etiquetas (pills).">
              <PillsInput
                value={form.locations}
                onChange={(items) => set("locations", items)}
                suggestions={locationOptions}
                placeholder="Ej: David, Chiriquí (Enter o Agregar)"
              />
            </Field>

            <Field
              label="Correos de recepción"
              hint="Correos que aparecen como botones en «Cómo aplicar»."
            >
              <PillsInput
                value={form.apply_emails}
                onChange={(items) => set("apply_emails", items)}
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </Field>

            <Field label="Documentos (PDF)">
              <FileUpload
                value={form.files}
                onChange={(files) => set("files", files)}
              />
            </Field>

            <Field label="Imágenes" hint="Se muestran en el contenido de la publicación.">
              <GalleryUpload
                value={form.images}
                onChange={(urls) => set("images", urls)}
              />
            </Field>

            <Field label="Estado">
              <select
                value={form.status}
                onChange={(e) =>
                  set("status", e.target.value as "open" | "closed" | "none")
                }
                className={inputClass}
              >
                <option value="open">Abierta</option>
                <option value="closed">Cerrada</option>
                <option value="none">Sin estado</option>
              </select>
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

      {/* Filtros */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, descripción o ubicación…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400"
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
      </div>

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : filtered.length ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {filtered.map((p) => {
              const status = postingStatus(p);
              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary-800">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted">
                      {p.closing_date
                        ? `Cierre: ${formatDate(p.closing_date)}`
                        : "Sin fecha de cierre"}
                    </p>
                  </div>
                  <span
                    className={
                      status === "abierta"
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        : status === "cerrada"
                          ? "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500"
                          : "rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-500"
                    }
                  >
                    {status === "abierta"
                      ? "Abierta"
                      : status === "cerrada"
                        ? "Cerrada"
                        : "Sin estado"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                      aria-label="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyState message="No hay registros que coincidan." />
      )}
    </div>
  );
}
