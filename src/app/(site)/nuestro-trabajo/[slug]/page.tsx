import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getSitePage } from "@/lib/data";
import { WORK_AREAS } from "@/lib/content";

const areas = WORK_AREAS.reduce<Record<string, (typeof WORK_AREAS)[number]>>(
  (acc, a) => {
    acc[a.slug] = a;
    return acc;
  },
  {},
);

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const area = areas[slug];
    return { title: area?.title ?? "Nuestro Trabajo" };
  })();
}

export default async function TrabajoAreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = areas[slug];
  if (!area) notFound();

  const page = await getSitePage(slug);

  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo"
        title={area.title}
        subtitle={area.description}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            {page?.content ? (
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="space-y-4 text-base leading-relaxed text-ink/80">
                <p>{area.description}</p>
                <p>
                  El contenido detallado de esta área estará disponible
                  próximamente. Para más información, no dude en contactarnos.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
