"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteTopbarLink, saveTopbarLink } from "@/lib/actions/topbar";
import type { TopbarLink } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";

const empty = {
  label: "",
  href: "",
  kind: "link" as "link" | "social",
  icon: "",
  sort_order: 0,
  is_active: true,
  is_external: false,
};

const socialOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
];

export default function TopbarAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<TopbarLink>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("topbar_links")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as TopbarLink[];
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TopbarLink | null>(null);
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

  function openEdit(l: TopbarLink) {
    setEditing(l);
    setForm({
      label: l.label,
      href: l.href,
      kind: l.kind === "social" ? "social" : "link",
      icon: l.icon ?? "",
      sort_order: l.sort_order,
      is_active: l.is_active,
      is_external: l.is_external,
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveTopbarLink({
      id: editing?.id,
      label: form.label,
      href: form.href,
      kind: form.kind,
      icon: form.kind === "social" ? form.icon : null,
      sort_order: form.sort_order,
      is_active: form.is_active,
      is_external: form.is_external,
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
    if (!window.confirm("¿Eliminar este enlace?")) return;
    await deleteTopbarLink(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Top Header"
        subtitle="Edita los enlaces y redes sociales del top header."
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
              {editing ? "Editar enlace" : "Nuevo enlace"}
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
              <Field label="Etiqueta *">
                <input
                  required
                  value={form.label}
                  onChange={(e) => set("label", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="URL *">
                <input
                  required
                  value={form.href}
                  onChange={(e) => set("href", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Tipo">
                <select
                  value={form.kind}
                  onChange={(e) =>
                    set("kind", e.target.value as "link" | "social")
                  }
                  className={inputClass}
                >
                  <option value="link">Enlace</option>
                  <option value="social">Red social</option>
                </select>
              </Field>
              {form.kind === "social" ? (
                <Field label="Red social">
                  <select
                    value={form.icon}
                    onChange={(e) => set("icon", e.target.value)}
                    className={inputClass}
                  >
                    {socialOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="Orden">
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => set("sort_order", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              )}
            </div>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-line text-primary-600"
                />
                Activo
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.is_external}
                  onChange={(e) => set("is_external", e.target.checked)}
                  className="h-4 w-4 rounded border-line text-primary-600"
                />
                Abrir en pestaña nueva
              </label>
            </div>

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
            {items.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary-800">{l.label}</p>
                  <p className="truncate text-xs text-muted">
                    {l.kind === "social" ? `Red social · ${l.icon}` : l.href}
                  </p>
                </div>
                {!l.is_active && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                    Inactivo
                  </span>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(l)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(l.id)}
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
        <EmptyState message="No hay enlaces en el top header." />
      )}
    </div>
  );
}
