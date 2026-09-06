"use client";

import { useRef, useState } from "react";
import { FilePlus, FileText, Loader2, X } from "lucide-react";

export interface UploadedFile {
  file_name: string;
  file_url: string;
  mime_type?: string;
}

export function FileUpload({
  value,
  onChange,
}: {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLoading(true);
    setError("");
    const uploaded: UploadedFile[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        uploaded.push({
          file_name: file.name,
          file_url: json.url,
          mime_type: json.mimeType,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir archivo");
        break;
      }
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 space-y-2">
          {value.map((f, i) => (
            <li
              key={`${f.file_url}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText size={16} className="shrink-0 text-accent-500" />
                <span className="truncate text-sm text-ink">{f.file_name}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                aria-label="Quitar archivo"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-600 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <FilePlus size={16} />}
        Agregar documento (PDF)
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
        onChange={handleFiles}
      />

      {error && <p className="mt-1.5 text-xs text-accent-600">{error}</p>}
    </div>
  );
}
