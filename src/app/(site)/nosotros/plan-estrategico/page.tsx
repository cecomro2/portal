import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { DocumentList } from "@/components/site/document-list";
import { getSitePage } from "@/lib/data";

export const metadata: Metadata = { title: "Plan Estratégico" };

const fallback =
  "El Plan Estratégico del CECOM-RO define las prioridades y líneas de acción para impulsar la competitividad de la Región Occidental, con un enfoque de largo plazo, articulación público-privada y alineación con los Objetivos de Desarrollo Sostenible.";

const documents = [
  {
    id: "plan-estrategico",
    label: "Plan Estratégico CECOMRO",
    file_url: "/uploads/Plan-Estrategico-CECOMRO.pdf",
  },
];

export default async function PlanEstrategicoPage() {
  const page = await getSitePage("plan-estrategico");

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Plan Estratégico"
        subtitle="La hoja de ruta del Centro para el desarrollo competitivo de la región."
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

      <section className="border-t border-line bg-surface py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-6 text-xl font-bold text-primary-800">
              Documentos
            </h2>
            <DocumentList documents={documents} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
