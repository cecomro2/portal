import type { Metadata } from "next";
import { Target, TrendingUp, Handshake, Users } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { MISSION } from "@/lib/site-config";

export const metadata: Metadata = { title: "Misión" };

const pillars = [
  {
    icon: TrendingUp,
    title: "Competitividad",
    text: "Acercamos a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles.",
  },
  {
    icon: Handshake,
    title: "Articulación",
    text: "Articulamos los esfuerzos públicos y privados, y contribuimos a su efectividad.",
  },
  {
    icon: Users,
    title: "Inclusión",
    text: "Promovemos la inclusión social y cultural, y las infraestructuras necesarias para el desarrollo.",
  },
];

export default function MisionPage() {
  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Misión"
        subtitle="Impulsar la posición competitiva de la Región Occidental del país."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <Reveal className="lg:col-span-2">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500">
                  <Target size={24} />
                </span>
                <p className="text-lg leading-relaxed text-ink">{MISSION}</p>
              </div>
            </Reveal>

            <div className="space-y-4">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="rounded-xl border border-line bg-surface p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <p.icon size={20} />
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-primary-800">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
