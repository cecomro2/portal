"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveMenuItem } from "@/lib/actions/menu";
import type { MenuItem } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  Field,
  inputClass,
} from "@/components/admin/ui";

export default function MenuAdminPage() {
  const router = useRouter();
  const { items, loading } = useAdminList<MenuItem>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as MenuItem[];
  });

  const [rows, setRows] = useState<
    Record<string, { label: string; href: string }>
  >({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const r: Record<string, { label: string; href: string }> = {};
    for (const it of items) r[it.key] = { label: it.label, href: it.href };
    setRows(r);
  }, [items]);

  function update(key: string, field: "label" | "href", value: string) {
    setRows((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  async function save(key: string, sort_order: number) {
    const r = rows[key];
    if (!r) return;
    setSaving(key);
    setMsg("");
    const res = await saveMenuItem({
      key,
      label: r.label,
      href: r.href,
      sort_order,
    });
    setSaving(null);
    setMsg(res.ok ? "Menú guardado." : res.error ?? "Error al guardar.");
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Bottom Header"
        subtitle="Edita los enlaces del menú principal (barra azul)."
      />

      <Card>
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.key}
                className="grid items-end gap-3 sm:grid-cols-[1fr_1.5fr_auto]"
              >
                <Field label="Etiqueta">
                  <input
                    value={rows[it.key]?.label ?? ""}
                    onChange={(e) => update(it.key, "label", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Enlace">
                  <input
                    value={rows[it.key]?.href ?? ""}
                    onChange={(e) => update(it.key, "href", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <button
                  onClick={() => save(it.key, it.sort_order)}
                  disabled={saving === it.key}
                  className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {saving === it.key ? "…" : "Guardar"}
                </button>
              </div>
            ))}

            {msg && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                {msg}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
