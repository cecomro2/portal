import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Cadenas de Valor Panamá-Costa Rica",
};

export default function CadenasDeValorPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Proyectos Ejecutados"
        title="Cadenas de Valor Panamá-Costa Rica"
        subtitle="Identificación de Cadenas de Valor para Paso Canoas y David Panamá, para el Sector Integración y Comercio."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 rounded-2xl border border-line bg-surface/50 p-8 lg:grid-cols-2 lg:gap-14 lg:p-12">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Sector Integración y Comercio
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-snug text-primary-700 sm:text-3xl">
                Identificación de Cadenas de Valor para Paso Canoas y David
                Panamá
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Informe final del proyecto para la Región Occidental de Panamá,
                orientado a identificar las cadenas de valor con mayor potencial
                entre Paso Canoas y David.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500">
                  <FileText size={28} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Informe Final — Región Occidental de Panamá
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href="/uploads/informe-final-cadenas-de-valor.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"
                    >
                      <FileText size={15} />
                      Ver Documento (PDF)
                    </a>
                    <a
                      href="/uploads/informe-final-cadenas-de-valor.pdf"
                      download
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2.5 text-xs font-semibold text-primary-700 transition hover:border-primary-300"
                    >
                      <Download size={15} />
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
