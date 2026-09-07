import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { VacancyList } from "@/components/site/vacancy-list";
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
          <VacancyList postings={postings} basePath={BASE} />
        </div>
      </section>
    </>
  );
}
