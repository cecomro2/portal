"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  deletePostingCategory,
  savePostingCategory,
} from "@/lib/actions/posting-categories";
import type { PostingCategory } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  inputClass,
} from "@/components/admin/ui";

export default function CategoriasAecidAdminPage() {
  const router = useRouter();
  const { items, loading, load } = useAdminList<PostingCategory>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("posting_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name");
    return (data ?? []) as PostingCategory[];
  });

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await savePostingCategory(name);
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Error al guardar.");
      return;
    }
    setName("");
    await load();
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    await deletePostingCategory(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Categorías AECID"
        subtitle="Categorías para vacantes y portal de compras."
      />

      <Card className="mb-6">
        <form onSubmit={onAdd} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nueva categoría"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            <Plus size={16} />
            Agregar
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-accent-600">{error}</p>}
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : items.length ? (
          <ul className="space-y-2">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white p-3"
              >
                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                  {c.name}
                </span>
                <button
                  onClick={() => onDelete(c.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                  aria-label="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No hay categorías. Agrega la primera." />
        )}
      </Card>
    </div>
  );
}
