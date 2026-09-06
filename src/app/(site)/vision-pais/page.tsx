import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getVisions } from "@/lib/data";

export const metadata: Metadata = { title: "Visión País" };

export default async function VisionPaisPage() {
  const visions = await getVisions();

  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Visión País"
        subtitle="Documentos de las visiones regionales 2050 de Panamá."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ul className="space-y-3">
            {visions.map((v, i) => (
              <Reveal key={v.id} delay={(i % 3) * 0.05}>
                <li>
                  <Link
                    href={`/vision-pais/${v.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                  >
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-accent-500 sm:text-base">
                      {v.title}
                    </span>
                    <ChevronRight
                      size={18}
                      className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-500"
                    />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
