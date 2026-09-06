import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "Red de Centros Regionales" };

const centers = [
  {
    code: "CECOMCE",
    title: "CECOMCE",
    region: "Colón y Región Oriental",
    text: "Impulso a la logística portuaria, zona franca y desarrollo productivo caribeño.",
    href: "/red-de-centros/cecomce",
  },
  {
    code: "CECOMCRO",
    title: "CECOMCRO",
    region: "Región Central",
    text: "Fomento agroindustrial y comercial para Coclé, Herrera, Los Santos y Veraguas.",
    href: "/red-de-centros/cecomcro",
  },
];

export default function RedCentrosPage() {
  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Red de Centros Regionales"
        subtitle="Una red de centros que impulsa la competitividad en las distintas regiones de Panamá."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {centers.map((c, i) => (
              <Reveal key={c.code} delay={i * 0.08}>
                <Link
                  href={c.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
                      {c.code.slice(-3)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-500">
                      <MapPin size={13} />
                      {c.region}
                    </span>
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-primary-800 group-hover:text-accent-500">
                    {c.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {c.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                    Conocer más
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
