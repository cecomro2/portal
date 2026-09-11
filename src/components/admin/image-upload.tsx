"use client";

import { useRef, useState } from "react";
import { Images, ImagePlus, Loader2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { MediaItem } from "@/lib/types";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No se pudo subir la imagen.");
      } else {
        onChange(json.url);
      }
    } catch {
      setError("Error de red al subir la imagen.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function openGallery() {
    setGalleryOpen(true);
    setGalleryLoading(true);
    setGallery([]);
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("media_items")
      .select("*")
      .eq("kind", "image")
      .order("created_at", { ascending: false });
    setGallery((data ?? []) as MediaItem[]);
    setGalleryLoading(false);
  }

  function pickFromGallery(url: string) {
    onChange(url);
    setGalleryOpen(false);
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block overflow-hidden rounded-lg border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Vista previa"
            className="h-36 w-full max-w-xs object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-950/70 text-white transition hover:bg-primary-950"
            aria-label="Quitar imagen"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex max-w-xs flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface text-muted transition hover:border-primary-300 hover:text-primary-600"
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-xs font-medium">Subir imagen</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={openGallery}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-primary-700 transition hover:border-primary-300"
          >
            <Images size={15} />
            Elegir de galería
          </button>
        </div>
      )}

      {value && (
        <div className="mt-2">
          <button
            type="button"
            onClick={openGallery}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-primary-700 transition hover:border-primary-300"
          >
            <Images size={15} />
            Elegir de galería
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="mt-1.5 text-xs text-accent-600">{error}</p>}

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-primary-950/70 p-4 backdrop-blur-sm"
          onClick={() => setGalleryOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line bg-primary-600 px-5 py-4">
              <h3 className="text-base font-bold text-white">
                Elegir imagen de la galería
              </h3>
              <button
                type="button"
                onClick={() => setGalleryOpen(false)}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-primary-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {galleryLoading ? (
                <p className="flex items-center gap-2 py-8 text-sm text-muted">
                  <Loader2 size={18} className="animate-spin" />
                  Cargando galería…
                </p>
              ) : gallery.length ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {gallery.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => pickFromGallery(m.file_url)}
                      className="group overflow-hidden rounded-lg border border-line transition hover:border-primary-400"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.file_url}
                        alt={m.title}
                        className="aspect-square w-full object-cover transition group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">
                  No hay imágenes en la galería. Sube la primera.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
