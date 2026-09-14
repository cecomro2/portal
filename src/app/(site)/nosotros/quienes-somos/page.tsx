import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Timeline, type TimelineEntry } from "@/components/site/timeline";
import { QUIENES_SOMOS_FULL } from "@/lib/content";

export const metadata: Metadata = { title: "Quiénes Somos" };

const desarrollamos: TimelineEntry[] = [
  {
    period: "En Curso",
    title:
      "Programa Soluciones Integrales de Acceso Universal a la Energía en la Comarca Ngäbe Buglé para aterrizaje de la Agenda 2030.",
    details: ["Fondos: LAIF-AECID", "Ejecución Directa de Fondos"],
  },
  {
    period: "En Curso",
    title:
      "Programa Desarrollo Integral Territorial en la Comarca Ngäbe Buglé y derechos humanos",
    details: ["Fondos: AECID", "Ejecución Directa de Fondos"],
  },
  {
    period: "En Curso",
    title: "Programa Panamá Productiva III – Clúster de Frutas y Logística",
    details: [
      "Fondos – Corporación Andina de Fomento CAF",
      "Ejecución en alianza con la Fundación Ciudad del Saber",
    ],
  },
  {
    period: "En Curso",
    title:
      "Programa de Promoción del Circuito del Café & Diseño del Circuito Agroindustrial de Tierras Bajas y Golfo de Chiriquí",
    details: [
      "Fondos – Autoridad de Turismo de Panamá",
      "Ejecutor Principal en alianza con la Fundación Circuito del Café",
    ],
  },
  {
    period: "2023",
    title:
      "Programa de Liderazgo Comunitario para 20 líderes de 3 corregimientos del Distrito de Barú, Chiriquí y Plan de Apoyo Comunitario",
    details: ["Fondos: Forever Oceans", "Ejecución Directa de Fondos"],
  },
  {
    period: "2023",
    title:
      "Programa de Sensibilización y Plan de Desarrollo Comunitario de los Corregimientos de Chiriquí, Pedregal, y Boca Chica.",
    details: ["Fondos: Puerto Barú en David", "Ejecución Directa de Fondos"],
  },
  {
    period: "2022",
    title:
      "Mapeo de Necesidades en 3 corregimientos del Distrito de Barú, Chiriquí & Plan de Apoyo Comunitario",
    details: ["Fondos: Forever Oceans", "Ejecución Directa de Fondos"],
  },
  {
    period: "2022-2023",
    title:
      "Mapeo de la Deserción Escolar en 5 corregimientos de la Región Occidental",
    details: ["Fondos: PNUD", "Ejecución Directa de Fondos"],
  },
  {
    period: "2021-2022",
    title: "Programa de Desarrollo y Promoción del Circuito del Café",
    details: [
      "Fondos – Autoridad de Turismo de Panamá",
      "Ejecución Directa de Fondos",
    ],
  },
  {
    period: "2021-2022",
    title:
      "Piloto del Plan Operativo Cero Deserción Escolar en la Región Occidental",
    details: [
      "Ejecutor Principal en alianza con el PNUD y el MEDUCA",
      "Aliado Patrocinador – Embajada de los Estados Unidos de América",
    ],
  },
  {
    period: "2022",
    title: "Programa Panamá Productiva II – Clúster de Frutas",
    details: [
      "Fondos – Corporación Andina de Fomento CAF",
      "Acompañamiento Técnico a la empresa consultora",
    ],
  },
  {
    period: "2022-2021",
    title:
      "Talleres de Consulta Ciudadana para el Diseño de la Política Agroalimentaria de Estado (PADE)",
    details: [
      "Fondos – Corporación Andina de Fomento CAF",
      "Ejecución Directa de Fondos",
    ],
  },
  {
    period: "2022-2019",
    title: "Programa de Promoción de Importaciones de los Países Bajos",
    details: [
      "Fondos – Unión Europea",
      "Aliado Técnico al CBI – Centro de Promoción de Importaciones",
    ],
  },
  {
    period: "2021",
    title:
      'Proyecto "Identificación de Cambios para la Transformación de Zonas Fronterizas Aeroportuarias de Favorezca el Desarrollo Logístico Fronterizo de Paso Canoas y David Panamá y su relación con la Visión RO 2050"',
    details: [
      "Fondos – Banco Interamericano de Desarrollo",
      "Acompañamiento Técnico a la empresa consultora",
    ],
  },
  {
    period: "2019",
    title:
      'Proyecto "Apoyo del CECOMRO a las MIPYMES del sector Eco-Agroturismo en Gualaca, Boquete, Tierras Altas y Renacimiento a través de métodos de asociatividad, eco-sostenibilidad e inclusión en el Circuito del Café de Chiriquí"',
    details: [
      "Fondos: Banco Centroamericano de Integración Económica",
      "Ejecución Directa de Fondos",
    ],
  },
  {
    period: "2019-2018",
    title: "Diseño del Plan Integral de Movilidad Urbana Sustentable de David",
    details: [
      "Fondos – Banco de Desarrollo de América Latina CAF",
      "Acompañamiento Técnico a la empresa consultora",
    ],
  },
  {
    period: "2019-2018",
    title: "Diseño Integral del Circuito del Café",
    details: ["Fondos – Banco Mundial", "Ejecución Directa de Fondos"],
  },
  {
    period: "2019-2018",
    title:
      "Diseño del Plan Indicativo de Ordenamiento Territorial de Boca Chica y Plan Maestro de Boca Chica como Destino de Turismo Sostenible",
    details: ["Fondos – Banco Mundial", "Ejecución Directa de Fondos"],
  },
  {
    period: "2018",
    title: "Diseño de las Visiones Regionales 2050 a nivel nacional",
    details: ["Fondos: SENACYT", "Ejecución Directa de Fondos"],
  },
  {
    period: "2016-2017",
    title: "Diseño del Plan Maestro del Agro de la Región Occidental",
    details: [
      "Fondos – Banco de Desarrollo de América Latina CAF",
      "Acompañamiento Técnico a la empresa consultora",
    ],
  },
  {
    period: "2016",
    title:
      "Diseño del Plan Maestro para el Desarrollo Integral y Sostenible del Distrito de Barú",
    details: [
      "Fondos – Banco de Desarrollo de América Latina CAF",
      "Acompañamiento Técnico a la empresa consultora",
    ],
  },
];

const impulsamos: TimelineEntry[] = [
  {
    period: "Actualmente",
    title:
      "Plan de Empoderamiento Económico de las Mujeres Indígenas de Panamá (PEMIP 2025)",
    details: ["Ejecuta: MINGOB"],
  },
  {
    period: "Actualmente",
    title: "Pacto Bicentenario «Cerrando Brechas»",
    details: ["Ejecuta: Ministerio de la Presidencia / PNUD"],
  },
  {
    period: "Actualmente",
    title: "Plan de Integración Logística Aduanera",
    details: ["Ejecuta: Autoridad Nacional de ADUANAS"],
  },
  {
    period: "Actualmente",
    title: "Plan Nacional de Competitividad Industrial",
    details: ["Ejecuta: Ministerio de Comercio e Industrias"],
  },
  {
    period: "Actualmente",
    title:
      "Programa de Desarrollo Urbano Integral de Ciudades con Vocación Turística",
    details: ["Ejecuta: Autoridad de Turismo / Banco Interamericano de Desarrollo"],
  },
  {
    period: "Actualmente",
    title:
      "Programa de Apoyo al Desarrollo Productivo a través del Capital Humano",
    details: ["Ejecuta: ITSE / Banco Interamericano de Desarrollo"],
  },
];

const pertenecemos = [
  "CIPAR – AIP",
  "CIPAC – AIP",
  "CEMCIT – AIP",
  "Fundación Circuito del Café",
  "REDCADET",
  "Consejo Nacional Logístico (COEL)",
];

export default function QuienesSomosPage() {
  const paragraphs = QUIENES_SOMOS_FULL.split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Quiénes Somos"
        subtitle="Una Fundación de Interés Privado sin fines de lucro, de carácter público-privado, dedicada a impulsar la competitividad de la Región Occidental de Panamá."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-ink/80">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { value: "2015", label: "Año de fundación" },
              { value: "84", label: "Asociados y aliados" },
              { value: "Público-Privado", label: "Carácter institucional" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface p-6 text-center"
              >
                <p className="text-3xl font-bold text-primary-700">{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface/50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
              Nuestra trayectoria
            </p>
            <h2 className="mt-2 text-3xl font-bold text-primary-700">
              Desarrollamos
            </h2>
          </Reveal>

          <div className="mt-10">
            <Timeline entries={desarrollamos} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
              En alianza
            </p>
            <h2 className="mt-2 text-3xl font-bold text-primary-700">
              Impulsamos
            </h2>
          </Reveal>

          <div className="mt-10">
            <Timeline entries={impulsamos} />
          </div>
        </div>
      </section>

      <section className="bg-surface/50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
              Redes y asociaciones
            </p>
            <h2 className="mt-2 text-3xl font-bold text-primary-700">
              Pertenecemos a
            </h2>

            <ol className="mt-8 space-y-3">
              {pertenecemos.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-base font-medium text-ink">{item}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
