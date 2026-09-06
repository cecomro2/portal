import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getSitePage } from "@/lib/data";

export const metadata: Metadata = { title: "CECOMCRO" };

const fallback =
  "CECOMCRO articula la competitividad agroindustrial y comercial de las provincias de Coclé, Herrera, Los Santos y Veraguas.";

export default async function CecomcroPage() {
  const page = await getSitePage("cecomcro");

  return (
    <>
      <PageHeader
        kicker="Red de Centros Regionales"
        title="CECOMCRO"
        subtitle="Región Central."
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
              <p className="text-base leading-relaxed text-ink/80">{fallback}</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
