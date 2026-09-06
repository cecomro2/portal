"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteBanner, saveBanner } from "@/lib/actions/banners";
import type { Banner } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";

const empty = {
  title: "",
  subtitle: "",
  badge: "",
  cta_label: "",
  cta_href: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export function BannerManager() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<Banner>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Banner[];
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      badge: b.badge ?? "",
      cta_label: b.cta_label ?? "",
      cta_href: b.cta_href ?? "",
      image_url: b.image_url,
      sort_order: b.sort_order,
      is_active: b.is_active,
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveBanner({ id: editing?.id, ...form });
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
    if (!window.confirm("¿Eliminar este banner?")) return;
    await deleteBanner(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Banner de inicio"
        subtitle="Gestiona las diapositivas del hero de la página principal."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Nuevo slide
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar slide" : "Nuevo slide"}
            </h2>
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
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Insignia (badge)"
                hint="Texto pequeño que aparece arriba del título."
              >
                <input
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Texto del botón">
                <input
                  value={form.cta_label}
                  onChange={(e) => set("cta_label", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Enlace del botón" hint="Ej. /nosotros/quienes-somos">
                <input
                  value={form.cta_href}
                  onChange={(e) => set("cta_href", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Orden">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Imagen de fondo">
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => set("image_url", url)}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="h-4 w-4 rounded border-line text-primary-600"
              />
              Activo
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

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-xl border border-line bg-white"
            >
              <div className="relative aspect-[16/9] bg-primary-100">
                {b.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300 text-sm font-bold text-primary-500">
                    Sin imagen
                  </div>
                )}
                {!b.is_active && (
                  <span className="absolute left-2 top-2 rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Inactivo
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary-800">
                    {b.title}
                  </p>
                  <p className="text-xs text-muted">Orden: {b.sort_order}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No hay slides. Crea el primero para el hero del inicio." />
      )}
    </div>
  );
}
