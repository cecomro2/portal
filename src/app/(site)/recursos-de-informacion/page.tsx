import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Recursos de Información" };

const base =
  "https://web.archive.org/web/20190818154307/http://www.cecomro.com/wp-content/uploads/";

const resources = [
  { title: "Informe del Mercado Laboral Agosto 2016", url: `${base}2018/07/Informe-del-Mercado-Laboral-Agosto-2016-1.pdf` },
  { title: "Global Entrepreneurship Monitor Panamá 2017", url: `${base}2018/06/GEM2017.pdf` },
  { title: "La ineficiencia de la desigualdad", url: `${base}2018/05/La-ineficiencia-de-la-desigualdad-1.pdf` },
  { title: "Libro Iniciativas Clúster en Colombia", url: `${base}2018/05/libro_iniciativas_cluster_en_colombia.pdf` },
  { title: "Panamá 2013", url: `${base}2018/04/2013-Panam%C3%A1-t3t-ed.pdf` },
  { title: "Antecedentes y actualidad de la Visión Chiriquí", url: `${base}2018/04/Antecedentes-y-actualidad-de-la-Visi%C3%B3n-Chiriqu%C3%AD-revisado-.pdf` },
  { title: "La Visión Chiriquí 2025 — CECOMCHI y Proyectos Prioritarios", url: `${base}2018/04/La-Visi%C3%B3n-Chiriqu%C3%AD-2025-CECOMCHI-y-Proyectos-Prioritarios-Final.pdf` },
  { title: "Perfil Estratégico Concha Negra", url: `${base}2018/04/Perfil-Estrat%C3%A9gico-Concha-Negra.pdf` },
  { title: "Plan Estratégico de Gobierno 2015-2019", url: `${base}2018/04/Plan-Estrategico-de-Gobierno-2015-2019.pdf` },
  { title: "Situación del Recurso Concha", url: `${base}2018/04/Situacion-del-Recurso-Concha.pdf` },
  { title: "Empleos para crecer — Resumen Ejecutivo", url: `${base}2018/04/Empleos_para_crecer_-_Resumen_Ejecutivo.pdf` },
  { title: "Mensajes principales MDCR Panamá — Fase 2", url: `${base}2018/07/Mensajes-principales-MDCR-Panama%CC%81-Fase-2-Version-Baja-TResolucion-2.pdf` },
];

export default function RecursosPage() {
  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Recursos de Información"
        subtitle="Documentos, informes y publicaciones del Centro."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ul className="space-y-3">
            {resources.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 0.05}>
                <li>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                  >
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-accent-500 sm:text-base">
                      {r.title}
                    </span>
                    <ExternalLink
                      size={18}
                      className="shrink-0 text-muted transition group-hover:text-accent-500"
                    />
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
