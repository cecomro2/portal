"use client";

import { useRef, useState } from "react";
import { ImagePlus, Images, Loader2, X } from "lucide-react";
import { uploadFile } from "@/lib/upload-client";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import type { MediaItem } from "@/lib/types";

export function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLoading(true);
    setError("");
    const uploaded: string[] = [];
    for (const file of files) {
      try {
        const result = await uploadFile(file);
        uploaded.push(result.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir");
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
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-950/70 text-white transition hover:bg-primary-950"
                aria-label="Quitar imagen"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-600 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImagePlus size={16} />
          )}
          Agregar imágenes
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-primary-700 transition hover:border-primary-300"
        >
          <Images size={16} />
          Elegir de galería
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />

      {error && <p className="mt-1.5 text-xs text-accent-600">{error}</p>}

      <MediaPickerModal
        open={pickerOpen}
        kind="image"
        multiple
        onClose={() => setPickerOpen(false)}
        onSelect={(items: MediaItem[]) => {
          const urls = items.map((m) => m.file_url);
          onChange([...value, ...urls.filter((u) => !value.includes(u))]);
        }}
      />
    </div>
  );
}
