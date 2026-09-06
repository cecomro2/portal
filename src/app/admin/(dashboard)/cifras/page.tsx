"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteHomeStat, saveHomeStat } from "@/lib/actions/home-stats";
import { saveSiteSetting } from "@/lib/actions/settings";
import type { HomeStat } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";

const empty = { value: "", label: "", sort_order: 0 };

export default function CifrasAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<HomeStat>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("home_stats")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as HomeStat[];
  });

  const [sobreImage, setSobreImage] = useState("");
  const [savingImage, setSavingImage] = useState(false);
  const [imageMsg, setImageMsg] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HomeStat | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "sobre_home_image")
      .maybeSingle()
      .then(({ data }) => setSobreImage(data?.value ?? ""));
  }, []);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }

  function openEdit(s: HomeStat) {
    setEditing(s);
    setForm({ value: s.value, label: s.label, sort_order: s.sort_order });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveHomeStat({ id: editing?.id, ...form });
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
    if (!window.confirm("¿Eliminar esta cifra?")) return;
    await deleteHomeStat(id);
    await load();
    router.refresh();
  }

  async function saveImage() {
    setSavingImage(true);
    setImageMsg("");
    const res = await saveSiteSetting("sobre_home_image", sobreImage);
    setSavingImage(false);
    setImageMsg(
      res.ok ? "Imagen guardada correctamente." : res.error ?? "Error",
    );
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Cifras del Home"
        subtitle="Edita las cifras clave que aparecen debajo del slider y la imagen de la sección Sobre Nosotros."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Agregar cifra
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar cifra" : "Nueva cifra"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-3">
            <Field label="Arriba (número o texto) *">
              <input
                required
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Abajo (número o texto) *">
              <input
                required
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
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

            {error && (
              <p className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700 sm:col-span-3">
                {error}
              </p>
            )}

            <div className="flex gap-2 sm:col-span-3">
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
            {items.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary-700">
                    {s.value}
                  </span>
                  <span className="text-sm text-muted">{s.label}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
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
        <EmptyState message="No hay cifras. Agrega la primera." />
      )}

      <Card className="mt-8">
        <h2 className="text-lg font-bold text-primary-800">
          Imagen «Sobre Nosotros» (formato 4:5)
        </h2>
        <p className="mt-1 text-sm text-muted">
          Esta imagen se muestra a la derecha de la sección Sobre Nosotros del
          home.
        </p>
        <div className="mt-4">
          <ImageUpload value={sobreImage} onChange={setSobreImage} />
        </div>
        {imageMsg && <p className="mt-3 text-sm text-emerald-700">{imageMsg}</p>}
        <button
          onClick={saveImage}
          disabled={savingImage}
          className="mt-4 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {savingImage ? "Guardando…" : "Guardar imagen"}
        </button>
      </Card>
    </div>
  );
}
