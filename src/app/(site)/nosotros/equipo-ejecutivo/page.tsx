import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PersonCard } from "@/components/site/person-card";
import { Reveal } from "@/components/site/reveal";
import { getExecutiveTeam } from "@/lib/data";

export const metadata: Metadata = { title: "Equipo Ejecutivo" };

export default async function EquipoEjecutivoPage() {
  const team = await getExecutiveTeam();

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Equipo Ejecutivo"
        subtitle="El equipo que gestiona y ejecuta los programas y proyectos del Centro."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {team.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={(i % 4) * 0.06}>
                  <PersonCard person={m} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              La información del Equipo Ejecutivo estará disponible próximamente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
