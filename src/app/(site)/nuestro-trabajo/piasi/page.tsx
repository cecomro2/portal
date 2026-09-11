import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = { title: "PIASI" };

export default function PiasiPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo"
        title="PIASI"
        subtitle="Proyecto PIASI — CECOM-RO."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-4 text-base leading-relaxed text-ink/80">
              <p>
                El contenido detallado de este proyecto estará disponible
                próximamente.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
