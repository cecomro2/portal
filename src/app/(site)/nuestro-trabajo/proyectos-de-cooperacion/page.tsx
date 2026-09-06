import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Proyectos de Cooperación" };

const items = [
  {
    icon: Briefcase,
    title: "Vacantes AECID",
    text: "Consulta las oportunidades laborales disponibles y postúlate a las convocatorias abiertas.",
    href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid",
  },
  {
    icon: ShoppingCart,
    title: "Portal de Compras AECID",
    text: "Accede a los procesos de adquisición, licitaciones y documentos del portal de compras.",
    href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid",
  },
];

export default function ProyectosCooperacionPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo"
        title="Proyectos de Cooperación"
        subtitle="Convocatorias, vacantes y procesos de compra vinculados a los proyectos de cooperación con AECID."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((it, i) => (
              <Reveal key={it.href} delay={i * 0.08}>
                <Link
                  href={it.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition group-hover:bg-accent-500 group-hover:text-white">
                    <it.icon size={26} />
                  </span>
                  <h2 className="mt-6 text-xl font-bold text-primary-800 group-hover:text-accent-500">
                    {it.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {it.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                    Acceder
                    <ArrowRight
                      size={16}
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
