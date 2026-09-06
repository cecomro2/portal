import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getConsultants } from "@/lib/data";

export const metadata: Metadata = { title: "Red de Consultores" };

export default async function ConsultoresPage() {
  const consultants = await getConsultants();

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Red de Consultores"
        subtitle="Profesionales y especialistas que acompañan el desarrollo de programas y proyectos del Centro."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {consultants.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {consultants.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.07}>
                  <div className="flex h-full gap-4 rounded-xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photo_url}
                        alt={c.name}
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg font-bold text-primary-500">
                        {c.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("")}
                      </span>
                    )}
                    <div>
                      <h3 className="text-base font-semibold text-primary-800">
                        {c.name}
                      </h3>
                      {c.specialty && (
                        <p className="text-sm font-medium text-accent-500">
                          {c.specialty}
                        </p>
                      )}
                      {c.bio && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {c.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              La red de consultores estará disponible próximamente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
