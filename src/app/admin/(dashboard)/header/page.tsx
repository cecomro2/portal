"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveSiteSetting } from "@/lib/actions/settings";
import { deleteHeaderItem, saveHeaderItem } from "@/lib/actions/header-items";
import type { HeaderItem } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { IconPicker } from "@/components/admin/icon-picker";

const empty = {
  title: "",
  subtitle: "",
  href: "",
  icon: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function HeaderAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<HeaderItem>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("header_items")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as HeaderItem[];
  });

  const [logo, setLogo] = useState("/logo-cecomro.png");
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoMsg, setLogoMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HeaderItem | null>(null);
  const [form, setForm] = useState(empty);
  const [mediaMode, setMediaMode] = useState<"icon" | "image">("icon");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "header_logo")
      .maybeSingle()
      .then(({ data }) => setLogo(data?.value || "/logo-cecomro.png"));
  }, []);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing(null);
    setForm({ ...empty, sort_order: items.length + 1 });
    setMediaMode("icon");
    setError("");
    setOpen(true);
  }

  function openEdit(h: HeaderItem) {
    setEditing(h);
    setForm({
      title: h.title,
      subtitle: h.subtitle ?? "",
      href: h.href,
      icon: h.icon ?? "",
      image_url: h.image_url ?? "",
      sort_order: h.sort_order,
      is_active: h.is_active,
    });
    setMediaMode(h.image_url ? "image" : "icon");
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveHeaderItem({
      id: editing?.id,
      title: form.title,
      subtitle: form.subtitle || null,
      href: form.href,
      icon: mediaMode === "icon" ? form.icon || null : null,
      image_url: mediaMode === "image" ? form.image_url || null : null,
      sort_order: form.sort_order,
      is_active: form.is_active,
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
    if (!window.confirm("¿Eliminar este elemento del header?")) return;
    await deleteHeaderItem(id);
    await load();
    router.refresh();
  }

  async function saveLogo() {
    setSavingLogo(true);
    setLogoMsg("");
    const res = await saveSiteSetting("header_logo", logo);
    setSavingLogo(false);
    setLogoMsg(res.ok ? "Logo guardado." : res.error ?? "Error");
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Header"
        subtitle="Configura el logo y los elementos (título, subtítulo, enlace e icono) que aparecen junto al logo."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Agregar elemento
          </button>
        }
      />

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-primary-800">Logo</h2>
        <div className="mt-4">
          <ImageUpload value={logo} onChange={setLogo} />
        </div>
        {logoMsg && <p className="mt-3 text-sm text-emerald-700">{logoMsg}</p>}
        <button
          onClick={saveLogo}
          disabled={savingLogo}
          className="mt-4 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {savingLogo ? "Guardando…" : "Guardar logo"}
        </button>
      </Card>

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar elemento" : "Nuevo elemento"}
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
              <Field label="Enlace *">
                <input
                  required
                  value={form.href}
                  onChange={(e) => set("href", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Gráfico">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaMode("icon")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      mediaMode === "icon"
                        ? "bg-primary-600 text-white"
                        : "border border-line bg-white text-muted hover:text-primary-700"
                    }`}
                  >
                    Icono
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode("image")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      mediaMode === "image"
                        ? "bg-primary-600 text-white"
                        : "border border-line bg-white text-muted hover:text-primary-700"
                    }`}
                  >
                    Imagen
                  </button>
                </div>
              </Field>
              <Field label="Orden">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>

            {mediaMode === "icon" ? (
              <Field label="Icono">
                <IconPicker value={form.icon} onChange={(v) => set("icon", v)} />
              </Field>
            ) : (
              <Field label="Imagen">
                <ImageUpload
                  value={form.image_url}
                  onChange={(v) => set("image_url", v)}
                />
              </Field>
            )}

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
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {items.map((h) => (
              <li
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary-800">{h.title}</p>
                  <p className="truncate text-xs text-muted">
                    {h.subtitle ? `${h.subtitle} · ` : ""}
                    {h.href}
                  </p>
                </div>
                {!h.is_active && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                    Inactivo
                  </span>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(h)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState message="No hay elementos en el header. Agrega el primero." />
      )}
    </div>
  );
}
