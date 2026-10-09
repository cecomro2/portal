import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { VacancyList } from "@/components/site/vacancy-list";
import { getPostings } from "@/lib/data";

export const metadata: Metadata = { title: "Vacantes" };

export default async function VacantesPage() {
  const postings = await getPostings("general_vacancy");
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo"
        title="Vacantes"
        subtitle="Oportunidades laborales y convocatorias generales."
      />
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <VacancyList postings={postings} basePath="/vacantes" />
        </div>
      </section>
    </>
  );
}
