import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { QUIENES_SOMOS_FULL } from "@/lib/content";

export const metadata: Metadata = { title: "Quiénes Somos" };

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
                <p key={i} className={i === 0 ? "text-lg text-ink" : undefined}>
                  {p}
                </p>
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
    </>
  );
}
