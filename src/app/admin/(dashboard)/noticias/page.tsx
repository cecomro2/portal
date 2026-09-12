"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deletePost, savePost } from "@/lib/actions/posts";
import type { Post, PostCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { FileUpload, type UploadedFile } from "@/components/admin/file-upload";
import { VideoList, type VideoItem } from "@/components/admin/video-list";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category_id: "" as string,
  published_at: new Date().toISOString().slice(0, 10),
  is_published: true,
  author: "",
  images: [] as string[],
  files: [] as UploadedFile[],
  videos: [] as VideoItem[],
};

export default function NoticiasAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<Post>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    return (data ?? []) as Post[];
  });

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => setCategories((data ?? []) as PostCategory[]));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const hay = `${p.title} ${p.excerpt ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (categoryFilter !== "all" && p.category_id !== categoryFilter) {
        return false;
      }
      if (dateFilter !== "all") {
        const d = new Date(p.published_at).getTime();
        const day = 86_400_000;
        const days =
          dateFilter === "30d" ? 30 : dateFilter === "90d" ? 90 : 365;
        if (Date.now() - d > days * day) return false;
      }
      return true;
    });
  }, [items, query, dateFilter, categoryFilter]);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }

  async function openEdit(p: Post) {
    const supabase = createBrowserSupabase();
    const [{ data: imgs }, { data: files }, { data: videos }] = await Promise.all([
      supabase
        .from("post_images")
        .select("image_url")
        .eq("post_id", p.id)
        .order("sort_order"),
      supabase
        .from("post_files")
        .select("*")
        .eq("post_id", p.id)
        .order("sort_order"),
      supabase
        .from("post_videos")
        .select("*")
        .eq("post_id", p.id)
        .order("sort_order"),
    ]);
    setEditing(p);
    setForm({
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content ?? "",
      cover_image_url: p.cover_image_url ?? "",
      category_id: p.category_id ?? "",
      published_at: p.published_at?.slice(0, 10) ?? "",
      is_published: p.is_published,
      author: p.author ?? "",
      images: (imgs ?? []).map((i) => i.image_url),
      files: (files ?? []).map((f) => ({
        file_name: f.file_name,
        file_url: f.file_url,
        mime_type: f.mime_type,
      })),
      videos: (videos ?? []).map((v) => ({
        title: v.title,
        video_url: v.video_url,
      })),
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await savePost({
      id: editing?.id,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      cover_image_url: form.cover_image_url,
      category_id: form.category_id || null,
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : new Date().toISOString(),
      is_published: form.is_published,
      author: form.author,
      images: form.images.map((url) => ({ image_url: url })),
      files: form.files,
      videos: form.videos,
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
    if (!window.confirm("¿Eliminar esta noticia?")) return;
    await deletePost(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Noticias"
        subtitle="Gestiona el blog y sus publicaciones."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Nueva noticia
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar noticia" : "Nueva noticia"}
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

            <Field label="Extracto" hint="Resumen breve que aparece en las listas.">
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Contenido (texto enriquecido)">
              <RichTextEditor
                value={form.content}
                onChange={(html) => set("content", html)}
              />
            </Field>

            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Categoría">
                <select
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">— Sin categoría —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Fecha de publicación">
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => set("published_at", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Autor">
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Imagen de portada">
              <ImageUpload
                value={form.cover_image_url}
                onChange={(url) => set("cover_image_url", url)}
              />
            </Field>

            <Field label="Galería de imágenes">
              <GalleryUpload
                value={form.images}
                onChange={(urls) => set("images", urls)}
              />
            </Field>

            <Field label="Documentos (PDF)">
              <FileUpload
                value={form.files}
                onChange={(files) => set("files", files)}
              />
            </Field>

            <Field
              label="Videos (YouTube)"
              hint="Agrega uno o más videos; se insertan como reproductores embebidos."
            >
              <VideoList
                value={form.videos}
                onChange={(videos) => set("videos", videos)}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
                className="h-4 w-4 rounded border-line text-primary-600"
              />
              Publicada
            </label>

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
            placeholder="Buscar por título o extracto…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary-400"
        >
          <option value="all">Categoría: Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
              const cat = categories.find((c) => c.id === p.category_id);
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
                      {cat?.name ?? "Sin categoría"} ·{" "}
                      {formatDate(p.published_at)}
                    </p>
                  </div>
                  {!p.is_published && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                      Borrador
                    </span>
                  )}
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
        <EmptyState message="No hay noticias que coincidan." />
      )}
    </div>
  );
}
