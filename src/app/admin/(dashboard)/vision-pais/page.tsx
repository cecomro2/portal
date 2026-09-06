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
  deleteVision,
  deleteVisionDocument,
  saveVision,
  saveVisionDocument,
} from "@/lib/actions/visions";
import type { Vision, VisionDocument } from "@/lib/types";
import { useAdminList } from "@/components/admin/use-admin-list";
import {
  AdminPageHeader,
  Card,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/ui";

export default function VisionPaisAdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const { items: visions, loading, load } = useAdminList<Vision>(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("visions")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data ?? []) as Vision[];
  });

  const [selected, setSelected] = useState<Vision | null>(null);
  const [documents, setDocuments] = useState<VisionDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const [vFormOpen, setVFormOpen] = useState(false);
  const [editingVision, setEditingVision] = useState<Vision | null>(null);
  const [vTitle, setVTitle] = useState("");
  const [vOrder, setVOrder] = useState(0);

  const [dFormOpen, setDFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VisionDocument | null>(null);
  const [dLabel, setDLabel] = useState("");
  const [dUrl, setDUrl] = useState("");
  const [dOrder, setDOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadDocs(v: Vision) {
    setDocsLoading(true);
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("vision_documents")
      .select("*")
      .eq("vision_id", v.id)
      .order("sort_order", { ascending: true });
    setDocuments((data ?? []) as VisionDocument[]);
    setDocsLoading(false);
  }

  useEffect(() => {
    if (selected) loadDocs(selected);
    else setDocuments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function openNewVision() {
    setEditingVision(null);
    setVTitle("");
    setVOrder(visions.length + 1);
    setError("");
    setVFormOpen(true);
  }

  function openEditVision(v: Vision) {
    setEditingVision(v);
    setVTitle(v.title);
    setVOrder(v.sort_order);
    setError("");
    setVFormOpen(true);
  }

  async function onSubmitVision(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveVision({
      id: editingVision?.id,
      title: vTitle,
      sort_order: vOrder,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setVFormOpen(false);
    await load();
    router.refresh();
  }

  async function onDeleteVision(id: string) {
    if (!window.confirm("¿Eliminar esta visión y sus documentos?")) return;
    await deleteVision(id);
    if (selected?.id === id) setSelected(null);
    await load();
    router.refresh();
  }

  function openNewDoc() {
    setEditingDoc(null);
    setDLabel("");
    setDUrl("");
    setDOrder(documents.length + 1);
    setError("");
    setDFormOpen(true);
  }

  function openEditDoc(d: VisionDocument) {
    setEditingDoc(d);
    setDLabel(d.label);
    setDUrl(d.file_url);
    setDOrder(d.sort_order);
    setError("");
    setDFormOpen(true);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) setError(json.error ?? "Error al subir");
    else setDUrl(json.url);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmitDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    const res = await saveVisionDocument({
      id: editingDoc?.id,
      vision_id: selected.id,
      label: dLabel,
      file_url: dUrl,
      sort_order: dOrder,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Ocurrió un error.");
      return;
    }
    setDFormOpen(false);
    await loadDocs(selected);
    router.refresh();
  }

  async function onDeleteDoc(id: string) {
    if (!window.confirm("¿Eliminar este documento?")) return;
    await deleteVisionDocument(id);
    if (selected) await loadDocs(selected);
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Visión País"
        subtitle="Gestiona las visiones (páginas) y sus documentos PDF."
        action={
          <button
            onClick={openNewVision}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Nueva visión
          </button>
        }
      />

      {vFormOpen && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editingVision ? "Editar visión" : "Nueva visión"}
            </h2>
            <button
              onClick={() => setVFormOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSubmitVision} className="grid gap-4 sm:grid-cols-3">
            <Field label="Título *">
              <input
                required
                value={vTitle}
                onChange={(e) => setVTitle(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Orden">
              <input
                type="number"
                value={vOrder}
                onChange={(e) => setVOrder(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setVFormOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visiones */}
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Visiones
          </h2>
          {loading ? (
            <p className="text-sm text-muted">Cargando…</p>
          ) : visions.length ? (
            <ul className="space-y-2">
              {visions.map((v) => (
                <li
                  key={v.id}
                  className={`flex items-center justify-between gap-2 rounded-lg border p-3 ${
                    selected?.id === v.id
                      ? "border-primary-400 bg-primary-50"
                      : "border-line bg-white"
                  }`}
                >
                  <button
                    onClick={() => setSelected(v)}
                    className="min-w-0 flex-1 text-left text-sm font-medium text-ink hover:text-primary-700"
                  >
                    {v.title}
                  </button>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditVision(v)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary-50 hover:text-primary-700"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteVision(v.id)}
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
            <EmptyState message="No hay visiones." />
          )}
        </Card>

        {/* Documentos de la visión seleccionada */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Documentos {selected ? `· ${selected.title}` : ""}
            </h2>
            {selected && (
              <button
                onClick={openNewDoc}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700"
              >
                <Plus size={14} />
                Agregar
              </button>
            )}
          </div>

          {!selected ? (
            <p className="text-sm text-muted">
              Selecciona una visión para editar sus documentos PDF.
            </p>
          ) : docsLoading ? (
            <p className="text-sm text-muted">Cargando…</p>
          ) : documents.length ? (
            <ul className="space-y-2">
              {documents.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white p-3"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText size={16} className="shrink-0 text-accent-500" />
                    <span className="truncate text-sm text-ink">{d.label}</span>
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditDoc(d)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary-50 hover:text-primary-700"
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteDoc(d.id)}
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
              Esta visión no tiene documentos. Agrega el primero.
            </p>
          )}
        </Card>
      </div>

      {/* Formulario de documento */}
      {dFormOpen && selected && (
        <Card className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-800">
              {editingDoc ? "Editar documento" : "Nuevo documento"}
            </h2>
            <button
              onClick={() => setDFormOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={onSubmitDoc} className="grid gap-4">
            <Field label="Etiqueta *">
              <input
                required
                value={dLabel}
                onChange={(e) => setDLabel(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="PDF *">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-600"
                  >
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                    {dUrl ? "Cambiar PDF" : "Subir PDF"}
                  </button>
                  {dUrl && (
                    <span className="truncate text-xs text-muted">
                      PDF cargado
                    </span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleFile}
                />
              </Field>
              <Field label="Orden">
                <input
                  type="number"
                  value={dOrder}
                  onChange={(e) => setDOrder(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || !dUrl}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setDFormOpen(false)}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
