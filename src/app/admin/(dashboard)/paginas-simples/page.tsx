"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteSimplePage, saveSimplePage } from "@/lib/actions/simple-pages";
import type { SimplePage } from "@/lib/types";
import { flattenNav } from "@/lib/site-config";
import { SIMPLE_PAGE_TEMPLATES } from "@/lib/simple-page-templates";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";

const parentOptions = [
  "#en-ejecucion",
  "#ejecutados",
  "#impulsamos",
  ...flattenNav().filter((p) => p.href.startsWith("/")).map((p) => p.href),
];

export default function SimplePagesAdminPage() {
  const router = useRouter();

  const { items: pages, loading, load } = useAdminList<SimplePage>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("simple_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as SimplePage[];
  });

  const [pageFormOpen, setPageFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SimplePage | null>(null);
  const [pTitle, setPTitle] = useState("");
  const [pPath, setPPath] = useState("");
  const [pParent, setPParent] = useState("");
  const [pContent, setPContent] = useState("");
  const [pOrder, setPOrder] = useState(0);
  const [pActive, setPActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyTemplate(id: string, html: string) {
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = html;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  function openNewPage() {
    setEditingPage(null);
    setPTitle("");
    setPPath("");
    setPParent("#ejecutados");
    setPContent("");
    setPOrder(pages.length + 1);
    setPActive(true);
    setError("");
    setPageFormOpen(true);
  }

  function openEditPage(p: SimplePage) {
    setEditingPage(p);
    setPTitle(p.title);
    setPPath(p.path);
    setPParent(p.parent_href);
    setPContent(p.content);
    setPOrder(p.sort_order);
    setPActive(p.is_active);
    setError("");
    setPageFormOpen(true);
  }

  async function onSubmitPage(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveSimplePage({
      id: editingPage?.id,
      title: pTitle,
      path: pPath,
      content: pContent,
      parent_href: pParent,
      sort_order: pOrder,
      is_active: pActive,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setPageFormOpen(false);
    await load();
    router.refresh();
  }

  async function onDeletePage(id: string) {
    if (!window.confirm("¿Eliminar esta página?")) return;
    await deleteSimplePage(id);
    await load();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Páginas Simples"
        subtitle="Páginas con bloques de contenido (texto, imágenes y botones) ubicables en el menú."
        action={
          <button
            onClick={openNewPage}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Nueva página
          </button>
        }
      />

      {error && (
        <p className="mb-4 rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
          {error}
        </p>
      )}

      {pageFormOpen && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editingPage ? "Editar página" : "Nueva página"}
            </h2>
            <button
              onClick={() => setPageFormOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSubmitPage} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título *">
                <input
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Ruta (URL) *"
                hint="Ruta completa, ej: /nuestro-trabajo/ejecutados/piasi"
              >
                <input
                  required
                  value={pPath}
                  onChange={(e) => setPPath(e.target.value)}
                  placeholder="/ruta/de-la-pagina"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field
              label="Ubicación en el menú (href del padre) *"
              hint="Grupos: #en-ejecucion, #ejecutados o #impulsamos. También un href de menú."
            >
              <input
                required
                list="parent-href-options"
                value={pParent}
                onChange={(e) => setPParent(e.target.value)}
                placeholder="#ejecutados"
                className={inputClass}
              />
              <datalist id="parent-href-options">
                {parentOptions.map((href) => (
                  <option key={href} value={href} />
                ))}
              </datalist>
            </Field>
            <Field
              label="Contenido (HTML)"
              hint="Pega aquí los bloques copiados de las plantillas."
            >
              <textarea
                value={pContent}
                onChange={(e) => setPContent(e.target.value)}
                rows={10}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Orden">
                <input
                  type="number"
                  value={pOrder}
                  onChange={(e) => setPOrder(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 pt-6 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={pActive}
                  onChange={(e) => setPActive(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-primary-600"
                />
                Activa (visible en el menú)
              </label>
            </div>
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
                onClick={() => setPageFormOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Plantillas de contenido */}
      <Card className="mb-6">
        <h2 className="mb-1 text-lg font-bold text-primary-800">
          Plantillas de contenido
        </h2>
        <p className="mb-4 text-sm text-muted">
          Copia un bloque y pégalo en el campo «Contenido». Reemplaza los
          marcadores <code className="rounded bg-surface px-1 py-0.5 text-xs">URL_…</code>{" "}
          por tus enlaces o imágenes.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SIMPLE_PAGE_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-xl border border-line bg-surface p-4"
            >
              <p className="text-sm font-semibold text-ink">{t.label}</p>
              <p className="mt-1 flex-1 text-xs text-muted">{t.description}</p>
              <button
                type="button"
                onClick={() => copyTemplate(t.id, t.html)}
                className={`mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  copiedId === t.id
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {copiedId === t.id ? (
                  <>
                    <Check size={14} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copiar código
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Lista de páginas */}
      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Páginas
        </h2>
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : pages.length ? (
          <ul className="space-y-2">
            {pages.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white p-3"
              >
                <button
                  onClick={() => openEditPage(p)}
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <span className="block truncate text-sm font-medium text-ink transition hover:text-primary-700">
                    {p.title}
                    {!p.is_active && (
                      <span className="ml-2 text-xs text-muted">(inactiva)</span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {p.path}
                  </span>
                </button>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEditPage(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary-50 hover:text-primary-700"
                    aria-label="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDeletePage(p.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-50 hover:text-accent-600"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No hay páginas simples." />
        )}
      </Card>
    </div>
  );
}
