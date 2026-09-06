import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { MediaGallery } from "@/components/site/media-gallery";
import { getMediaItems } from "@/lib/data";

export const metadata: Metadata = { title: "Recursos de Información" };

export default async function RecursosPage() {
  const items = await getMediaItems();

  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Recursos de Información"
        subtitle="Galería de fotos, documentos y recursos multimedia del Centro."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MediaGallery items={items} />
        </div>
      </section>
    </>
  );
}
