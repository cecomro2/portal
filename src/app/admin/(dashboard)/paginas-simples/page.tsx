"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  deleteSimplePage,
  deleteSimplePageButton,
  saveSimplePage,
  saveSimplePageButton,
} from "@/lib/actions/simple-pages";
import type { SimplePage, SimplePageButton } from "@/lib/types";
import { flattenNav } from "@/lib/site-config";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";

const parentOptions = flattenNav()
  .filter((p) => p.href.startsWith("/"))
  .map((p) => p.href);

export default function SimplePagesAdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const { items: pages, loading, load } = useAdminList<SimplePage>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("simple_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as SimplePage[];
  });

  const [selected, setSelected] = useState<SimplePage | null>(null);
  const [buttons, setButtons] = useState<SimplePageButton[]>([]);
  const [buttonsLoading, setButtonsLoading] = useState(false);

  const [pageFormOpen, setPageFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SimplePage | null>(null);
  const [pTitle, setPTitle] = useState("");
  const [pPath, setPPath] = useState("");
  const [pParent, setPParent] = useState("");
  const [pContent, setPContent] = useState("");
  const [pOrder, setPOrder] = useState(0);
  const [pActive, setPActive] = useState(true);

  const [btnFormOpen, setBtnFormOpen] = useState(false);
  const [editingBtn, setEditingBtn] = useState<SimplePageButton | null>(null);
  const [bLabel, setBLabel] = useState("");
  const [bHref, setBHref] = useState("");
  const [bDownload, setBDownload] = useState(false);
  const [bOrder, setBOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadButtons(p: SimplePage) {
    setButtonsLoading(true);
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("simple_page_buttons")
      .select("*")
      .eq("page_id", p.id)
      .order("sort_order", { ascending: true });
    setButtons((data ?? []) as SimplePageButton[]);
    setButtonsLoading(false);
  }

  useEffect(() => {
    if (selected) loadButtons(selected);
    else setButtons([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (!selected && pages.length) setSelected(pages[0]);
  }, [pages, selected]);

  function openNewPage() {
    setEditingPage(null);
    setPTitle("");
    setPPath("");
    setPParent("/nuestro-trabajo/ejecutados/agro");
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
    if (!window.confirm("¿Eliminar esta página y sus botones?")) return;
    await deleteSimplePage(id);
    if (selected?.id === id) setSelected(null);
    await load();
    router.refresh();
  }

  function openNewButton() {
    setEditingBtn(null);
    setBLabel("");
    setBHref("");
    setBDownload(false);
    setBOrder(buttons.length + 1);
    setError("");
    setBtnFormOpen(true);
  }

  function openEditButton(b: SimplePageButton) {
    setEditingBtn(b);
    setBLabel(b.label);
    setBHref(b.href);
    setBDownload(b.is_download);
    setBOrder(b.sort_order);
    setError("");
    setBtnFormOpen(true);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Error al subir");
        return;
      }
      setBHref(json.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir el archivo",
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmitButton(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    const res = await saveSimplePageButton({
      id: editingBtn?.id,
      page_id: selected.id,
      label: bLabel,
      href: bHref,
      is_download: bDownload,
      sort_order: bOrder,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setBtnFormOpen(false);
    await loadButtons(selected);
    router.refresh();
  }

  async function onDeleteButton(id: string) {
    if (!window.confirm("¿Eliminar este botón?")) return;
    await deleteSimplePageButton(id);
    if (selected) await loadButtons(selected);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Páginas Simples"
        subtitle="Páginas con texto a la izquierda y botones a la derecha, ubicables en el menú."
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
                hint="Ruta completa, ej: /nuestro-trabajo/ejecutados/agro/piasi"
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
              hint="La página se anida bajo el item del menú con este enlace."
            >
              <input
                required
                list="parent-href-options"
                value={pParent}
                onChange={(e) => setPParent(e.target.value)}
                placeholder="/nuestro-trabajo/ejecutados/agro"
                className={inputClass}
              />
              <datalist id="parent-href-options">
                {parentOptions.map((href) => (
                  <option key={href} value={href} />
                ))}
              </datalist>
            </Field>
            <Field label="Texto (izquierda)">
              <textarea
                value={pContent}
                onChange={(e) => setPContent(e.target.value)}
                rows={5}
                className={inputClass}
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
                onClick={() => setPageFormOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}

      {btnFormOpen && selected && (
        <Card className="mb-6 border-accent-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editingBtn ? "Editar botón" : "Nuevo botón"}
            </h2>
            <button
              onClick={() => setBtnFormOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSubmitButton} className="grid gap-4">
            <Field label="Etiqueta del botón *">
              <input
                required
                value={bLabel}
                onChange={(e) => setBLabel(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Enlace o PDF *">
                <div className="flex items-center gap-3">
                  <input
                    required
                    value={bHref}
                    onChange={(e) => setBHref(e.target.value)}
                    placeholder="https://… o sube un PDF"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-3 py-2.5 text-xs font-medium text-muted transition hover:border-primary-300 hover:text-primary-600"
                  >
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    PDF
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleFile}
                  />
                </div>
              </Field>
              <Field label="Orden">
                <input
                  type="number"
                  value={bOrder}
                  onChange={(e) => setBOrder(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={bDownload}
                onChange={(e) => setBDownload(e.target.checked)}
                className="h-4 w-4 rounded border-line text-primary-600"
              />
              Botón de descarga (PDF)
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
                onClick={() => setBtnFormOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Páginas */}
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
                  className={`flex items-center justify-between gap-2 rounded-lg border p-3 ${
                    selected?.id === p.id
                      ? "border-primary-400 bg-primary-50"
                      : "border-line bg-white"
                  }`}
                >
                  <button
                    onClick={() => setSelected(p)}
                    className="min-w-0 flex-1 cursor-pointer text-left"
                  >
                    <span className="block truncate text-sm font-medium text-ink transition hover:text-primary-700">
                      {p.title}
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

        {/* Botones de la página seleccionada */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Botones {selected ? `· ${selected.title}` : ""}
            </h2>
            {selected && (
              <button
                onClick={openNewButton}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700"
              >
                <Plus size={14} />
                Agregar
              </button>
            )}
          </div>

          {!selected ? (
            <p className="text-sm text-muted">
              Selecciona una página para editar sus botones.
            </p>
          ) : buttonsLoading ? (
            <p className="text-sm text-muted">Cargando…</p>
          ) : buttons.length ? (
            <ul className="space-y-2">
              {buttons.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white p-3"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText size={16} className="shrink-0 text-accent-500" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">
                        {b.label}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {b.href}
                        {b.is_download ? " · descarga" : ""}
                      </span>
                    </span>
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditButton(b)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary-50 hover:text-primary-700"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteButton(b.id)}
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
            <p className="text-sm text-muted">
              Esta página no tiene botones. Agrega el primero.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
