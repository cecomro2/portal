import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { AREA_TITLES, GRUPO_LABELS } from "@/lib/site-config";

export function generateMetadata({
  params,
}: {
  params: Promise<{ grupo: string; area: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { area } = await params;
    return { title: AREA_TITLES[area] ?? "Área" };
  })();
}

export default async function GrupoAreaPage({
  params,
}: {
  params: Promise<{ grupo: string; area: string }>;
}) {
  const { grupo, area } = await params;
  const title = AREA_TITLES[area];
  const grupoLabel = GRUPO_LABELS[grupo];
  if (!title || !grupoLabel) notFound();

  return (
    <>
      <PageHeader
        kicker={`Nuestro Trabajo · ${grupoLabel}`}
        title={title}
        subtitle={`Línea de acción de ${title} dentro de ${grupoLabel}.`}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-base leading-relaxed text-ink/80">
              El contenido detallado de esta área estará disponible próximamente.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
