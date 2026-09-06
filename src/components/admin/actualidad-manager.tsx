"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveSiteSetting } from "@/lib/actions/settings";
import type { PostCategory } from "@/lib/types";
import { AdminPageHeader, Card } from "@/components/admin/ui";

export function ActualidadManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => setCategories((data ?? []) as PostCategory[]));
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home_news_categories")
      .maybeSingle()
      .then(({ data }) => {
        try {
          setSelected(data?.value ? (JSON.parse(data.value) as string[]) : []);
        } catch {
          setSelected([]);
        }
        setLoading(false);
      });
  }, []);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await saveSiteSetting(
      "home_news_categories",
      JSON.stringify(selected),
    );
    setSaving(false);
    setMsg(res.ok ? "Guardado correctamente." : res.error ?? "Error");
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Actualidad (Home)"
        subtitle="Elige qué categorías de noticias se muestran en la sección Actualidad del home. Si no seleccionas ninguna, se muestran las noticias más recientes de todas las categorías."
      />

      <Card>
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : categories.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 transition hover:border-primary-300"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(c.id)}
                  onChange={() => toggle(c.id)}
                  className="h-4 w-4 rounded border-line text-primary-600"
                />
                <span className="text-sm font-medium text-ink">{c.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No hay categorías. Créalas en «Noticias → Categorías».
          </p>
        )}

        {msg && (
          <p
            className={`mt-4 text-sm ${
              msg.startsWith("Guardado") ? "text-emerald-700" : "text-accent-600"
            }`}
          >
            {msg}
          </p>
        )}

        <button
          onClick={save}
          disabled={saving || loading}
          className="mt-5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar categorías"}
        </button>
      </Card>
    </div>
  );
}
