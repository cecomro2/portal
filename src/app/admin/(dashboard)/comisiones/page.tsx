"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  deleteCommission,
  deleteCommissionMember,
  saveCommission,
  saveCommissionMember,
} from "@/lib/actions/commissions";
import type { Commission, CommissionMember } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { cn } from "@/lib/utils";

const empty = {
  name: "",
  description: "",
  parent_id: "" as string,
  sort_order: 0,
};

export default function ComisionesAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<Commission>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("commissions")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Commission[];
  });

  const [members, setMembers] = useState<CommissionMember[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [memberFormFor, setMemberFormFor] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<CommissionMember | null>(
    null,
  );
  const [mName, setMName] = useState("");
  const [mPhoto, setMPhoto] = useState("");
  const [mOrder, setMOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Commission | null>(null);
  const [form, setForm] = useState(empty);

  async function loadMembers() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("commission_members")
      .select("*")
      .order("sort_order", { ascending: true });
    setMembers((data ?? []) as CommissionMember[]);
  }

  useEffect(() => {
    void loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function openEdit(c: Commission) {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description ?? "",
      parent_id: c.parent_id ?? "",
      sort_order: c.sort_order,
    });
    setError("");
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveCommission({
      id: editing?.id,
      name: form.name,
      description: form.description,
      parent_id: form.parent_id || null,
      sort_order: form.sort_order,
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
    if (
      !window.confirm("¿Eliminar esta comisión? (se eliminarán sus subcomisiones y personas)")
    )
      return;
    await deleteCommission(id);
    await load();
    router.refresh();
  }

  function openNewMember(commissionId: string) {
    setEditingMember(null);
    setMName("");
    setMPhoto("");
    setMOrder(
      members.filter((m) => m.commission_id === commissionId).length + 1,
    );
    setError("");
    setMemberFormFor(commissionId);
  }

  function openEditMember(m: CommissionMember) {
    setEditingMember(m);
    setMName(m.name);
    setMPhoto(m.photo_url ?? "");
    setMOrder(m.sort_order);
    setError("");
    setMemberFormFor(m.commission_id);
  }

  async function onSubmitMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberFormFor) return;
    setSaving(true);
    setError("");
    const res = await saveCommissionMember({
      id: editingMember?.id,
      commission_id: memberFormFor,
      name: mName,
      photo_url: mPhoto || null,
      sort_order: mOrder,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setMemberFormFor(null);
    await loadMembers();
    router.refresh();
  }

  async function onDeleteMember(id: string) {
    if (!window.confirm("¿Eliminar esta persona?")) return;
    await deleteCommissionMember(id);
    await loadMembers();
    router.refresh();
  }

  const parentOptions = items.filter((c) => c.id !== editing?.id);

  return (
    <div>
      <AdminPageHeader
        title="Comisiones de Trabajo"
        subtitle="Edita el organigrama de comisiones (nombre, descripción y jerarquía) y agrega personas a cada comisión."
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Agregar comisión
          </button>
        }
      />

      {open && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editing ? "Editar comisión" : "Nueva comisión"}
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
              <Field
                label="Comisión superior"
                hint="Para crear jerarquía (organigrama). Deja vacío para una comisión de primer nivel; puedes tener varias al mismo nivel."
              >
                <select
                  value={form.parent_id}
                  onChange={(e) => set("parent_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">— Sin comisión superior (nivel raíz) —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Descripción">
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
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
            {items.map((c) => {
              const parent = items.find((p) => p.id === c.parent_id);
              const commissionMembers = members.filter(
                (m) => m.commission_id === c.id,
              );
              const isExpanded = expanded === c.id;
              return (
                <li key={c.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-primary-800">{c.name}</p>
                      <p className="text-xs text-muted">
                        {parent
                          ? `Depende de: ${parent.name}`
                          : "Comisión raíz"}{" "}
                        · {commissionMembers.length} persona
                        {commissionMembers.length !== 1 && "s"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setExpanded(isExpanded ? null : c.id)
                        }
                        className="flex h-8 items-center gap-1 rounded-md px-2 text-muted transition hover:bg-primary-50 hover:text-primary-700"
                        aria-label="Personas"
                      >
                        <Users size={15} />
                        <ChevronDown
                          size={14}
                          className={cn("transition", isExpanded && "rotate-180")}
                        />
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-line bg-surface px-4 py-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-primary-800">
                          Personas
                        </h3>
                        <button
                          onClick={() => openNewMember(c.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                        >
                          <Plus size={14} />
                          Agregar persona
                        </button>
                      </div>

                      {commissionMembers.length ? (
                        <ul className="mt-3 space-y-2">
                          {commissionMembers.map((m) => (
                            <li
                              key={m.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white p-3"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                {m.photo_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={m.photo_url}
                                    alt={m.name}
                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-500">
                                    {m.name
                                      .split(/\s+/)
                                      .slice(0, 2)
                                      .map((w) => w[0]?.toUpperCase())
                                      .join("")}
                                  </span>
                                )}
                                <span className="truncate text-sm text-ink">
                                  {m.name}
                                </span>
                              </span>
                              <div className="flex shrink-0 gap-1">
                                <button
                                  onClick={() => openEditMember(m)}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary-50 hover:text-primary-700"
                                  aria-label="Editar persona"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => onDeleteMember(m.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-50 hover:text-accent-600"
                                  aria-label="Eliminar persona"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-muted">
                          Esta comisión no tiene personas.
                        </p>
                      )}

                      {memberFormFor === c.id && (
                        <form
                          onSubmit={onSubmitMember}
                          className="mt-4 grid gap-4 rounded-lg border border-line bg-white p-4"
                        >
                          <h4 className="text-sm font-semibold text-primary-800">
                            {editingMember ? "Editar persona" : "Nueva persona"}
                          </h4>
                          <Field label="Nombre *">
                            <input
                              required
                              value={mName}
                              onChange={(e) => setMName(e.target.value)}
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Foto">
                            <ImageUpload value={mPhoto} onChange={setMPhoto} />
                          </Field>
                          <Field label="Orden">
                            <input
                              type="number"
                              value={mOrder}
                              onChange={(e) => setMOrder(Number(e.target.value))}
                              className={inputClass}
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
                              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                            >
                              {saving ? "Guardando…" : "Guardar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMemberFormFor(null)}
                              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyState message="No hay comisiones. Agrega la primera." />
      )}
    </div>
  );
}
