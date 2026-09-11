import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "PILA",
  description:
    "Programa de Integración Logística Aduanera (PILA) — CECOM-RO.",
};

const intro =
  "El Programa de Integración Logística Aduanera (PILA) impulsa la integración logística y aduanera de la región, fortaleciendo la modernización de los puestos de paso fronterizo y la articulación público-privada para mejorar la competitividad y los procesos de comercio.";

export default function PilaPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Proyectos que Impulsamos"
        title="PILA"
        subtitle="Programa de Integración Logística Aduanera."
      />

      {/* Presentación PILA */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/pila-1.png"
                alt="Programa de Integración Logística Aduanera (PILA)"
                className="w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Logística
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                Programa de Integración Logística Aduanera
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {intro}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="/uploads/pila-presentacion.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"
                >
                  <FileText size={15} />
                  Ver Documento (PDF)
                </a>
                <a
                  href="/uploads/pila-presentacion.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2.5 text-xs font-semibold text-primary-700 transition hover:border-primary-300"
                >
                  <Download size={15} />
                  Descargar
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Puesto de Paso Canoas */}
      <section className="bg-surface/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Infraestructura Fronteriza
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                Nuevo Puesto de Paso Canoas
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Conoce los avances del proceso de licitación para la
                construcción del nuevo puesto de paso fronterizo de Canoas, una
                pieza clave para la integración logística y aduanera de la
                región.
              </p>

              <div className="mt-6">
                <a
                  href="https://ensegundos.com.pa/2020/03/06/aduanas-convocara-una-nueva-licitacion-para-construccion-de-nuevo-puesto-de-paso-canoas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-accent-600"
                >
                  <ExternalLink size={15} />
                  Ver noticia
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/pila-2.png"
                alt="Nuevo Puesto de Paso Canoas"
                className="w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
