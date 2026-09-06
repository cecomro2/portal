import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getSitePage } from "@/lib/data";

export const metadata: Metadata = { title: "CECOMCE" };

const fallback =
  "CECOMCE impulsa la logística portuaria, la zona franca y el desarrollo productivo de la provincia de Colón y la región oriental de Panamá.";

export default async function CecomcePage() {
  const page = await getSitePage("cecomce");

  return (
    <>
      <PageHeader
        kicker="Red de Centros Regionales"
        title="CECOMCE"
        subtitle="Colón y Región Oriental."
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
