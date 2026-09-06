import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PostingRow } from "@/components/site/posting-row";
import { Reveal } from "@/components/site/reveal";
import { getPostings } from "@/lib/data";

export const metadata: Metadata = { title: "Vacantes AECID" };

const BASE = "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid";

export default async function VacantesPage() {
  const postings = await getPostings("vacancy");

  return (
    <>
      <PageHeader
        kicker="Proyectos de Cooperación"
        title="Vacantes AECID"
        subtitle="Oportunidades laborales en el marco de los proyectos de cooperación con AECID."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {postings.length ? (
            <div className="space-y-4">
              {postings.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PostingRow posting={p} basePath={BASE} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              No hay vacantes publicadas en este momento.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
