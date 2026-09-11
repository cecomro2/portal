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
