"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { savePage } from "@/lib/actions/pages";
import { EDITABLE_PAGES } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  AdminPageHeader,
  Card,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function PaginasAdminPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(EDITABLE_PAGES[0].slug);
  const [title, setTitle] = useState(EDITABLE_PAGES[0].title);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage("");
    const supabase = createBrowserSupabase();
    supabase
      .from("site_pages")
      .select("*")
      .eq("slug", selected)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data) {
          setTitle(data.title || "");
          setContent(data.content || "");
        } else {
          const page = EDITABLE_PAGES.find((p) => p.slug === selected);
          setTitle(page?.title ?? "");
          setContent("");
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selected]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await savePage({ slug: selected, title, content });
    setSaving(false);
    if (!res.ok) {
      setMessage(res.error ?? "Ocurrió un error.");
    } else {
      setMessage("Contenido guardado correctamente.");
      router.refresh();
    }
  }

  const current = EDITABLE_PAGES.find((p) => p.slug === selected);

  return (
    <div>
      <AdminPageHeader
        title="Páginas"
        subtitle="Edita el contenido de texto de las páginas institucionales."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Páginas
          </h2>
          <ul className="space-y-1">
            {EDITABLE_PAGES.map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => setSelected(p.slug)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                    selected === p.slug
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted hover:bg-surface hover:text-primary-700",
                  )}
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-800">
                {current?.title}
              </h2>
              {current && (
                <a
                  href={current.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary-700"
                >
                  Ver página
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {loading ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Loader2 size={16} className="animate-spin" />
                Cargando…
              </p>
            ) : (
              <form onSubmit={onSave} className="space-y-4">
                <Field label="Título">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Contenido (texto enriquecido)">
                  <RichTextEditor
                    value={content}
                    onChange={(html) => setContent(html)}
                  />
                </Field>

                {message && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
                >
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
