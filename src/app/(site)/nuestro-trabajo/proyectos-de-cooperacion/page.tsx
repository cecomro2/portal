import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { ReadMorePopup } from "@/components/site/read-more-popup";
import { PostCard } from "@/components/site/post-card";
import { getPostsByCategory } from "@/lib/data";

export const metadata: Metadata = { title: "Proyectos de Cooperación AECID" };

const energia = {
  title: "Programa de Acceso Universal a la Energía en Panamá",
  subtitle: "Comarca Ngäbe Buglé",
  image: "/uploads/programa-de-acceso-universal-a-la-energia-en-panama.jpg",
  intro:
    'La propuesta supone una actuación integral para el aterrizaje de ODS, y la implementación del "Plan Colmena" concentrando acciones en el municipio de Kusapín (Región Ño Kribo), donde se electrificarán al menos 500 hogares con energía fotovoltaica. Al mismo tiempo, se llevarán a cabo intervenciones en los distritos de Kankintú, Santa Catalina, Jirondai y Besikó, adecuando instalaciones de energía fotovoltaica existentes de 4 Centros de Salud con 34.889 usuarios y 35 Centros educativos con 11.058 alumnos(as) y la dotación de energía en cooperativas de carácter productivo e instalaciones de uso comunitario. En total el proyecto beneficiará directamente a casi 50.000 personas.',
  more: [
    "La acción de mayor inversión corresponde a la instalación de sistemas fotovoltaicos en el distrito de Kusapín con soluciones basadas en las necesidades identificadas en los estudios elaborados por el Proyecto LAIF UE LA/2019/409-714 con un enfoque integral de generación de capacidades locales e innovación del modelo de gestión que garantice la sostenibilidad social, económica, técnica y ambiental en coordinación con la OER y el Municipio.",
    "Otra acción de gran impacto por el número de población beneficiada de forma directa, (población escolar y usuarios de centros de salud, más de 40.000 personas) es la reparación y rehabilitación de sistemas fotovoltaicos ubicados en escuelas y centros de salud. A través del proyecto se generarán modelos sostenibles para el funcionamiento adecuado de estos equipos ya existentes, potenciando la conectividad a internet y digitalización; y en algunas escuelas piloto se promoverán proyectos integrales (cocinas solares, bombeo solar para acceso a agua potable y saneamiento básico, huertos escolares, cosecha de agua, proyectos productivos, etc.) para apoyar una educación digna y alimentación saludable. Se tomarán en cuenta las lecciones aprendidas del pasado de otros proyectos de inversión financiados por la UE con equipos fotovoltaicos que dejaron de funcionar por falta de mantenimiento y presupuesto público para su reparación.",
    "La visión integral de la intervención promueve la coordinación de actores y la generación de consensos, que incluye el fortalecimiento de la institucionalidad de la municipalidad y de las capacidades locales para la operación, mantenimiento técnico, así como de la gestión de facturación y cobros desde el Municipio o cooperativa energética, con la participación de la Oficina de Electrificación Rural (OER), la Secretaría Nacional de Energía (SNE), Autoridad de Servicios Públicos (ASEP), Instituto Nacional de Formación Profesional y Capacitación (INADEH), Autoridad de la Pequeña y Mediana Empresa (AMPYME), entidades académicas y el Banco Interamericano de Desarrollo (BID).",
    "Un resultado adicional de esta acción pionera en Panamá es su sistematización, que permita la gestión del conocimiento y la escalabilidad o réplicas en otros puntos de la Comarca Ngäbe Buglé o el país.",
  ],
};

const desarrollo = {
  title: "Desarrollo Humano Sostenible en la Comarca",
  subtitle:
    "Desarrollo Integral Territorial en la Comarca Ngäbe Buglé y derechos humanos",
  image: "/uploads/desarrollo-humano-sostenible.png",
  intro:
    'El proyecto "Desarrollo Integral Territorial en la Comarca Ngäbe Buglé y derechos humanos", ejecutado por el Centro de Competitividad de la Región Occidental de Panamá (CECOMRO) con apoyo técnico y financiero de la AECID. Este proyecto articula además otras actuaciones de la Agencia Española de Cooperación Internacional para el Desarrollo (AECID) durante los últimos años y nuevas iniciativas con un enfoque territorial, multicultural y con perspectiva de género.',
  more: [
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
  ],
};

const quickLinks = [
  {
    icon: Briefcase,
    label: "Vacantes AECID",
    href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid",
  },
  {
    icon: ShoppingCart,
    label: "Portal de Compras AECID",
    href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid",
  },
];

export default async function ProyectosCooperacionPage() {
  const prensa = await getPostsByCategory("prensa-aecid");

  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo"
        title="Proyectos de Cooperación AECID"
        subtitle="Programas, convocatorias, vacantes y procesos de compra vinculados a los proyectos de cooperación con AECID."
      />

      {/* Programa de Acceso Universal a la Energía */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={energia.image}
                alt={energia.title}
                className="w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                {energia.subtitle}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                {energia.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {energia.intro}
              </p>

              <div className="mt-5">
                <ReadMorePopup
                  title={energia.title}
                  paragraphs={energia.more}
                  buttonLabel="Leer más"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-6">
                {quickLinks.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    <q.icon size={16} />
                    {q.label}
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Desarrollo Humano Sostenible en la Comarca */}
      <section className="border-t border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                {desarrollo.title}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                {desarrollo.subtitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {desarrollo.intro}
              </p>

              <div className="mt-5">
                <ReadMorePopup
                  title={desarrollo.subtitle}
                  paragraphs={desarrollo.more}
                  buttonLabel="Leer más"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={desarrollo.image}
                alt={desarrollo.title}
                className="w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Prensa */}
      {prensa.length > 0 && (
        <section className="border-t border-line bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-700 sm:text-3xl">
                  Prensa
                </h2>
                <Link
                  href="/noticias/categoria/prensa-aecid"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-accent-500"
                >
                  Ver todas
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {prensa.slice(0, 6).map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.07}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
