"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  RemoveFormatting,
  Underline,
  Quote,
  Pilcrow,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Unlink,
} from "lucide-react";
import { normalizeEditorUrl, setEditorLinkAttributes } from "@/lib/editor-links";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cellHtml(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

/**
 * Convierte texto pegado desde un PDF (columnas separadas por tabuladores o por
 * espacios múltiples) en una tabla HTML. Maneja celdas de varias líneas (las
 * líneas sin tabulador se unen a la celda anterior). Devuelve "" si no detecta
 * estructura tabular.
 */
function textToTableHtml(text: string): string {
  const rawLines = text.split(/\r?\n/).map((r) => r.trimEnd());
  const hasTabs = rawLines.some((l) => l.includes("\t"));

  let grid: string[][] = [];

  if (hasTabs) {
    // Filas con tabulador; las líneas sin tabulador son continuación de la
    // última celda (celdas de varias líneas).
    let current: string[] | null = null;
    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (line.includes("\t")) {
        if (current) grid.push(current);
        current = line.split("\t").map((c) => c.trim());
      } else if (current) {
        current[current.length - 1] = `${current[current.length - 1]}\n${trimmed}`;
      }
    }
    if (current) grid.push(current);
  } else {
    // Separador por espacios múltiples (2 o más)
    const spaceLines = rawLines.filter((l) => /\s{2,}/.test(l));
    if (spaceLines.length >= 2) {
      grid = spaceLines.map((l) =>
        l
          .split(/\s{2,}/)
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
      );
    }
  }

  if (grid.length < 2) return "";
  const colCount = Math.max(...grid.map((r) => r.length));
  if (colCount < 2) return "";

  const body = grid
    .map((row, ri) => {
      const tag = ri === 0 ? "th" : "td";
      const cells = Array.from({ length: colCount }, (_, i) => {
        const cell = row[i] ?? "";
        return `<${tag}>${cellHtml(cell)}</${tag}>`;
      }).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<table><tbody>${body}</tbody></table>`;
}

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-primary-50 hover:text-primary-700"
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const editingLink = useRef<HTMLAnchorElement | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [newTab, setNewTab] = useState(true);
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    emit();
  }

  function openLink() {
    const root = ref.current;
    if (!root) return;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    savedRange.current = range && root.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
    const node = savedRange.current?.startContainer;
    const element = node?.nodeType === Node.ELEMENT_NODE ? node as Element : node?.parentElement;
    const anchor = element?.closest("a");
    editingLink.current = anchor && root.contains(anchor) ? anchor : null;
    setLinkUrl(editingLink.current?.getAttribute("href") ?? "https://");
    setNewTab(editingLink.current ? editingLink.current.target === "_blank" : true);
    setLinkError(""); setLinkOpen(true);
  }

  function restoreRange() {
    const root = ref.current;
    if (!root) return;
    root.focus();
    const selection = window.getSelection();
    if (!selection) return;
    const range = savedRange.current && root.contains(savedRange.current.commonAncestorContainer)
      ? savedRange.current : document.createRange();
    if (range !== savedRange.current) { range.selectNodeContents(root); range.collapse(false); }
    selection.removeAllRanges(); selection.addRange(range);
  }

  function applyLink() {
    const url = normalizeEditorUrl(linkUrl);
    if (!url) { setLinkError("Usa https://, http://, mailto:, tel:, una ruta / o un ancla # válidos."); return; }
    const root = ref.current;
    if (!root) return;
    restoreRange();
    if (editingLink.current && root.contains(editingLink.current)) {
      setEditorLinkAttributes(editingLink.current, url, newTab);
    } else {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        const anchor = document.createElement("a");
        anchor.textContent = url;
        setEditorLinkAttributes(anchor, url, newTab);
        range.insertNode(anchor); range.setStartAfter(anchor); range.collapse(true);
        selection.removeAllRanges(); selection.addRange(range);
      } else {
        // Usa la URL real también en el historial nativo de deshacer/rehacer.
        const previousLinks = new Set(root.querySelectorAll("a"));
        const selectedRange = range.cloneRange();
        document.execCommand("createLink", false, url);
        root.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
          if (!previousLinks.has(anchor) || selectedRange.intersectsNode(anchor)) {
            setEditorLinkAttributes(anchor, url, newTab);
          }
        });
      }
    }
    setLinkOpen(false); emit();
  }

  function removeLink() {
    const root = ref.current;
    restoreRange();
    const anchor = editingLink.current;
    if (anchor && root?.contains(anchor)) anchor.replaceWith(...Array.from(anchor.childNodes));
    else document.execCommand("unlink", false);
    setLinkOpen(false); emit();
  }

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function onPaste(e: React.ClipboardEvent) {
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    // Si el HTML ya trae una tabla real, se respeta el pegado por defecto.
    if (html && /<table[\s>]/i.test(html)) return;

    // Caso PDF: el HTML suele ser texto suelto sin <table>, pero el texto plano
    // trae las columnas separadas por tabuladores o espacios → se convierte a tabla.
    const tableHtml = textToTableHtml(text);
    if (!tableHtml) return;

    e.preventDefault();
    document.execCommand("insertHTML", false, tableHtml);
    emit();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface px-2 py-1.5">
        <ToolbarButton title="Negrita" onClick={() => exec("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Cursiva" onClick={() => exec("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Subrayado" onClick={() => exec("underline")}>
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton title="Tachado" onClick={() => exec("strikeThrough")}><Strikethrough size={15} /></ToolbarButton>
        <ToolbarButton title="Párrafo normal / salir de cita" onClick={() => exec("formatBlock", "p")}><Pilcrow size={15} /></ToolbarButton>
        <span className="mx-1 h-4 w-px bg-line" />
        <ToolbarButton title="Título" onClick={() => exec("formatBlock", "h2")}>
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Subtítulo"
          onClick={() => exec("formatBlock", "h3")}
        >
          <Heading3 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Cita destacada" onClick={() => exec("formatBlock", "blockquote")}><Quote size={15} /></ToolbarButton>
        <ToolbarButton title="Alinear a la izquierda" onClick={() => exec("justifyLeft")}><AlignLeft size={15} /></ToolbarButton>
        <ToolbarButton title="Centrar" onClick={() => exec("justifyCenter")}><AlignCenter size={15} /></ToolbarButton>
        <ToolbarButton title="Alinear a la derecha" onClick={() => exec("justifyRight")}><AlignRight size={15} /></ToolbarButton>
        <span className="mx-1 h-4 w-px bg-line" />
        <ToolbarButton title="Lista" onClick={() => exec("insertUnorderedList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Lista numerada"
          onClick={() => exec("insertOrderedList")}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Enlace"
          onClick={openLink}
        >
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Quitar enlace del texto seleccionado" onClick={() => exec("unlink")}><Unlink size={15} /></ToolbarButton>
        <span className="mx-1 h-4 w-px bg-line" />
        <ToolbarButton
          title="Limpiar formato"
          onClick={() => exec("removeFormat")}
        >
          <RemoveFormatting size={15} />
        </ToolbarButton>
        <ToolbarButton title="Deshacer" onClick={() => exec("undo")}><Undo2 size={15} /></ToolbarButton>
        <ToolbarButton title="Rehacer" onClick={() => exec("redo")}><Redo2 size={15} /></ToolbarButton>
      </div>

      {linkOpen && <div role="dialog" aria-label="Editar enlace" className="border-b border-line bg-surface p-4" onKeyDown={(e) => {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setLinkOpen(false); restoreRange(); }
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault(); e.stopPropagation();
          if (e.target.type !== "checkbox") applyLink();
        }
      }}>
        <label className="block text-sm font-medium text-ink">URL del enlace
          <input aria-label="URL del enlace" autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" />
        </label>
        <label className="my-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} />Abrir en una pestaña nueva</label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={applyLink} className="rounded-lg bg-primary-600 px-3 py-2 text-sm text-white">Aplicar enlace</button>
          <button type="button" onClick={removeLink} className="rounded-lg border border-line px-3 py-2 text-sm">Quitar enlace</button>
          <button type="button" onClick={() => { setLinkOpen(false); restoreRange(); }} className="rounded-lg border border-line px-3 py-2 text-sm">Cancelar</button>
        </div>
        {linkError && <p role="alert" className="mt-2 text-sm text-red-600">{linkError}</p>}
      </div>}

      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-label="Contenido enriquecido"
        aria-multiline="true"
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        className="rich-text min-h-[220px] px-4 py-3 outline-none"
        data-placeholder="Escribe el contenido…"
      />
    </div>
  );
}
