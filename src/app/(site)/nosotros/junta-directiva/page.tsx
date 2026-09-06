import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PersonCard } from "@/components/site/person-card";
import { Reveal } from "@/components/site/reveal";
import { getBoardMembers } from "@/lib/data";

export const metadata: Metadata = { title: "Junta Directiva" };

export default async function JuntaDirectivaPage() {
  const members = await getBoardMembers();

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Junta Directiva"
        subtitle="Los líderes que orientan el rumbo estratégico del Centro de Competitividad de la Región Occidental."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {members.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m, i) => (
                <Reveal key={m.id} delay={(i % 4) * 0.06}>
                  <PersonCard person={m} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              La información de la Junta Directiva estará disponible próximamente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
