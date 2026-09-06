"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteAssociate, saveAssociate } from "@/lib/actions/associates";
import type { Associate } from "@/lib/types";
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
  name: "",
  logo_url: "",
  type: "asociado" as "asociado" | "aliado",
  website_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AsociadosAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<Associate>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("associates")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Associate[];
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Associate | null>(null);
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

  function openEdit(a: Associate) {
    setEditing(a);
    setForm({
      name: a.name,
      logo_url: a.logo_url ?? "",
      type: a.type,
      website_url: a.website_url ?? "",
      sort_order: a.sort_order,
      is_active: a.is_active,
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveAssociate({ id: editing?.id, ...form });
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
    await deleteAssociate(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Asociados y Aliados"
        subtitle="Gestiona la red de asociados y aliados del Centro."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Agregar
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

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Nombre *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Tipo">
                <select
                  value={form.type}
                  onChange={(e) =>
                    set("type", e.target.value as "asociado" | "aliado")
                  }
                  className={inputClass}
                >
                  <option value="asociado">Asociado</option>
                  <option value="aliado">Aliado</option>
                </select>
              </Field>
              <Field label="Sitio web">
                <input
                  value={form.website_url}
                  onChange={(e) => set("website_url", e.target.value)}
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
              <Field label="Logo">
                <ImageUpload
                  value={form.logo_url}
                  onChange={(url) => set("logo_url", url)}
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
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {items.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {a.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.logo_url}
                      alt={a.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-500">
                      {a.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-primary-800">
                      {a.name}
                    </p>
                    <p className="text-xs text-muted">{a.type}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(a)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
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
        <EmptyState message="No hay asociados ni aliados." />
      )}
    </div>
  );
}
