import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { DocumentList } from "@/components/site/document-list";
import { getSitePage } from "@/lib/data";

export const metadata: Metadata = { title: "Plan Estratégico" };

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

      {page?.content ? (
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </Reveal>
          </div>
        </section>
      ) : null}

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
