import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { WORK_AREAS } from "@/lib/content";

export const metadata: Metadata = { title: "Nuestro Trabajo" };

export default function NuestroTrabajoPage() {
  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Nuestro Trabajo"
        subtitle="Programas, proyectos y áreas estratégicas que impulsan el desarrollo competitivo de la Región Occidental."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/nuestro-trabajo/proyectos-de-cooperacion"
              className="group flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white transition hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Handshake size={24} />
                </span>
                <div>
                  <h2 className="text-xl font-bold">Proyectos de Cooperación</h2>
                  <p className="mt-1 max-w-2xl text-sm text-primary-100">
                    Vacantes AECID y Portal de Compras AECID en el marco de los
                    proyectos de cooperación internacional.
                  </p>
                </div>
              </div>
              <ArrowRight
                size={20}
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_AREAS.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 3) * 0.07}>
                <Link
                  href={`/nuestro-trabajo/${area.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-primary-800 group-hover:text-accent-500">
                    {area.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {area.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                    Explorar
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
