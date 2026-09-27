"use client";

import { useEffect, useRef } from "react";
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
} from "lucide-react";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Convierte texto pegado desde un PDF (con columnas separadas por tabuladores)
 * en una tabla HTML. Devuelve "" si no detecta estructura tabular.
 */
function textToTableHtml(text: string): string {
  const rows = text
    .split(/\r?\n/)
    .map((r) => r.trimEnd())
    .filter((r) => r.includes("\t"));
  if (!rows.length) return "";

  const grid = rows.map((row) => row.split("\t").map((c) => c.trim()));
  const colCount = Math.max(...grid.map((r) => r.length));
  const hasHeader = grid.length >= 2;

  const body = grid
    .map((row, ri) => {
      const tag = hasHeader && ri === 0 ? "th" : "td";
      const cells = Array.from({ length: colCount }, (_, i) => {
        const cell = row[i] ?? "";
        return `<${tag}>${escapeHtml(cell)}</${tag}>`;
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

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    emit();
  }

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function onPaste(e: React.ClipboardEvent) {
    // Si el portapapeles trae HTML (Word/Excel/otro), se deja el pegado por defecto.
    const html = e.clipboardData.getData("text/html");
    if (html) return;

    const text = e.clipboardData.getData("text/plain");
    if (!text || !text.includes("\t")) return;

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
          onClick={() => {
            const url = window.prompt("URL del enlace:", "https://");
            if (url) exec("createLink", url);
          }}
        >
          <Link2 size={15} />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-line" />
        <ToolbarButton
          title="Limpiar formato"
          onClick={() => exec("removeFormat")}
        >
          <RemoveFormatting size={15} />
        </ToolbarButton>
      </div>

      <div
        ref={ref}
        contentEditable
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
