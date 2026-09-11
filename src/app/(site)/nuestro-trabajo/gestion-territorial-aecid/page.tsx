import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { ReadMorePopup } from "@/components/site/read-more-popup";

export const metadata: Metadata = { title: "Gestión Territorial AECID" };

const intro =
  'El proyecto "Desarrollo Integral Territorial en la Comarca Ngäbe Buglé y derechos humanos", ejecutado por el Centro de Competitividad de la Región Occidental de Panamá (CECOMRO) con apoyo técnico y financiero de la AECID. Este proyecto articula además otras actuaciones de la Agencia Española de Cooperación Internacional para el Desarrollo (AECID) durante los últimos años y nuevas iniciativas con un enfoque territorial, multicultural y con perspectiva de género.';

const more = [
  "El marco de referencia de la propuesta son las líneas de acción del V Plan director sobre todo en lo que tiene que ver con las iniciativas para lograr la consecución del cumplimiento de los Objetivos de Desarrollo Sostenible (ODS).",
  'En el caso de la Comarca Ngäbe Buglé, se presentan altos índices de pobreza que han quedado de manifiesto en el último informe sobre el "Índice de Pobreza Multidimensional (IPM-C) a nivel de distritos y corregimientos, usando los Censos de Población y Vivienda de Panamá".',
  "Tomando como referencia dicho informe del total de corregimientos del país, noventa y ocho (98) de ellos presentan altos porcentajes de pobreza multidimensional con más del 90% del total de su población en esa condición; de estos, cincuenta y cinco (55) pertenecen a la Comarca Ngäbe Buglé, es decir más de la mitad de las personas en pobreza multidimensional del país se concentra en ese sector de la geografía panameña.",
  "Esta situación plantea la necesidad de concentrar las actuaciones en la Comarca Ngäbe Buglé, donde la AECID ha venido ejecutando a la fecha una serie de intervenciones relevantes, asociadas al Programa de Agua y Saneamiento Rural e indígena por parte de la DISAPAS-MINSA, así como alianzas público-privadas para dotar de acceso a luz eléctrica a las comunidades más alejadas.",
  "En este mismo contexto, es importante mencionar la aprobación por parte de la UE en el año 2019 del primer proyecto de Cooperación delegada de la AECID en Panamá (Proyecto de acceso universal a la energía en Panamá, Comarca Ngäbe Buglé. Convenio de Contribución LA/2019/409-714). La iniciativa incorpora aspectos relativos al fortalecimiento de las capacidades locales, la necesidad de abordar la brecha digital, la gobernanza territorial y el acceso a los servicios básicos de agua y energía, la canalización de los conflictos a través de la mediación comunitaria, los retos asociados a la variable climática y medioambiental, el enfoque multicultural y de género, por último, procesos de identificación de iniciativas de emprendimiento para la dinamización productiva.",
  "Esta serie de iniciativas están enfocadas a disminuir los impactos de la pobreza multidimensional y mejorar las condiciones de vida de las personas, la desigualdad y de acceso a la justicia y la conflictividad social, para progresivamente alcanzar los desafíos del desarrollo.",
  "Para ello, la propuesta articula componentes claves entre los que podemos destacar: 1) el fortalecimiento de las capacidades de planificación estratégica y ordenación territorial, a través de procesos de capacitación institucional local, así como el apoyo para la mejora de infraestructura básica; 2) la promoción de la coordinación interinstitucional con competencias en materia de justicia comunitaria y generación de capacidades de mediación, a través de procesos de formación y organización socio comunitaria; 3) el impulso a las alianzas multiactor junto al MIDA, IDIAP, y FNSC, que permitirá dar seguimiento a las actividades del Proyecto y la articulación de nuevas dinámicas para la promoción e implementación de la agricultura familiar; 4) la promoción de las Mesas de Desarrollo Territorial (MDT) como instancia de articulación para la ejecución de las intervenciones de la CE en la Comarca orientadas a la generación de una visión territorial desde la perspectiva multicultural; 5) en materia de género apoyar a las organizaciones de mujeres de la Comarca, para lo cual se llevarán a cabo capacitaciones específicas con las organizaciones socio comunitarias de mujeres, a efectos de fortalecer y apoyar su liderazgo y la promoción en los espacios de incidencia; 6) gestión de conocimiento y comunicación del Proyecto.",
  "La iniciativa se desarrolla teniendo como ejes transversales, el enfoque de género, juventud y multiculturalismo, aspectos que se trasladan a cada actividad, materiales didácticos, compendios y normativas a publicar. La participación de instituciones locales, tradicionales y sectoriales se enmarca en la perspectiva del ODS 17. Se trata, por tanto, de generar alianzas que permitan consolidar las políticas públicas en los territorios de la Comarca basadas en la colaboración y cooperación de los saberes tradicionales y las formas de organización política del Estado con presencia en la región. Así mismo, la propuesta trasciende el ámbito de influencia a la Comarca Ngäbe y se contempla la posibilidad de generar sinergias con instituciones sectoriales de ámbito central y organizaciones de coordinación indígena, a efectos de generar iniciativas que tengan replicabilidad en otras áreas del país.",
  "El componente territorial estará enfocado al fortalecimiento de la capacidad institucional de los gobiernos locales. Las actuaciones tienen el propósito de mejorar las capacidades de gestión y administración municipal, concentrando las actuaciones en los municipios de la Comarca Ngäbe Buglé, donde la Agencia Española de Cooperación para el Desarrollo (AECID) se ha concentrado territorialmente.",
  "En el ámbito territorial, y mediante asistencias técnicas especializadas, se fortalecerá la prestación de los servicios públicos para asegurar la equidad y calidad de acceso, cobertura, calidad y sostenibilidad; propiciando el análisis técnico y político y la realización de propuestas de adecuación que involucren la planificación y participación social.",
];

export default function GestionTerritorialAecidPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Proyectos Ejecutados"
        title="Gestión Territorial AECID"
        subtitle="Desarrollo Integral Territorial en la Comarca Ngäbe Buglé y derechos humanos."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Desarrollo Humano Sostenible en la Comarca
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                Desarrollo Integral Territorial en la Comarca Ngäbe Buglé
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {intro}
              </p>

              <div className="mt-5">
                <ReadMorePopup
                  title="Gestión Territorial AECID"
                  paragraphs={more}
                  buttonLabel="Leer más"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/desarrollo-humano-sostenible.png"
                alt="Desarrollo Integral Territorial en la Comarca Ngäbe Buglé"
                className="w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
