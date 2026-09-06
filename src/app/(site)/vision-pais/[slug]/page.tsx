import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { DocumentList } from "@/components/site/document-list";
import { getVisionBySlug, getVisionDocuments } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vision = await getVisionBySlug(slug);
  return { title: vision?.title ?? "Visión" };
}

export default async function VisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vision = await getVisionBySlug(slug);
  if (!vision) notFound();

  const documents = await getVisionDocuments(vision.id);

  return (
    <>
      <PageHeader
        kicker="Visión País"
        title={vision.title}
        subtitle="Documentos disponibles de esta visión regional."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <DocumentList
            documents={documents.map((d) => ({
              id: d.id,
              label: d.label,
              file_url: d.file_url,
            }))}
          />
        </div>
      </section>
    </>
  );
}
