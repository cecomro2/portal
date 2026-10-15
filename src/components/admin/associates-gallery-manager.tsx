"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { saveAssociatesGallery } from "@/lib/actions/ecosystem";
import type { AssociatesGallery } from "@/lib/ecosystem";

export function AssociatesGalleryManager({ initial }: { initial: AssociatesGallery }) {
  const [gallery, setGallery] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  function move(index: number, offset: number) {
    const images = [...gallery.images]; const target = index + offset;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    setGallery({ ...gallery, images });
  }
  async function save() {
    setSaving(true); setMessage("");
    try { const result = await saveAssociatesGallery(gallery); setMessage(result.ok ? "Galería guardada." : result.error ?? "Error al guardar."); if(result.ok) router.refresh(); }
    catch { setMessage("No se pudo guardar. Intenta nuevamente."); }
    finally { setSaving(false); }
  }
  return <div><AdminPageHeader title="Galería de Asociados y Aliados" subtitle="Imágenes a color sobre fondo gris. Las nuevas cargas se guardan en Cloudflare R2." />
    <fieldset disabled={saving}><Card><GalleryUpload value={gallery.images} onChange={(images) => setGallery({ ...gallery, images })} />
      {gallery.images.length > 0 && <div className="mt-5 space-y-2"><p className="text-sm font-semibold">Orden de las imágenes</p>{gallery.images.map((url, index) => <div key={`${url}-${index}`} className="flex items-center gap-3 rounded border border-line p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={`Imagen ${index + 1}`} className="h-16 w-24 object-contain" /><span className="text-sm">{index + 1}</span><button type="button" disabled={!index} onClick={() => move(index, -1)}>Subir</button><button type="button" disabled={index === gallery.images.length - 1} onClick={() => move(index, 1)}>Bajar</button>
      </div>)}</div>}
      <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={gallery.showIndividual} onChange={(e) => setGallery({ ...gallery, showIndividual: e.target.checked })} />Mostrar también las fichas individuales de asociados y aliados</label>
      <p className="mt-3 text-sm text-muted">Los registros individuales se conservan. <Link className="text-primary-600 underline" href="/admin/asociados">Administrar fichas individuales</Link></p>
      <button type="button" onClick={save} className="mt-5 rounded-lg bg-primary-600 px-5 py-2 text-white">{saving ? "Guardando…" : "Guardar galería"}</button>
    </Card></fieldset><p role="status" className="mt-4 text-sm">{message}</p></div>;
}
