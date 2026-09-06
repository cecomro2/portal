import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Circuito del Café" };

const pdfUrl = "/uploads/Manual-Operativo-del-Circuito-del-Café.pdf";

export default function CircuitoCafePage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Turismo"
        title="Circuito del Café"
        subtitle="El circuito del café de Chiriquí, cuna del café Geisha más premiado del planeta."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner-cafe.png"
            alt="Circuito del Café"
            className="w-full rounded-2xl border border-line object-cover"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://circuitodelcafe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <ExternalLink size={16} />
              Visitar circuitodelcafe.com
            </a>
            <a
              href={`/api/download?url=${encodeURIComponent(pdfUrl)}&name=${encodeURIComponent("Manual-Operativo-del-Circuito-del-Café.pdf")}`}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-sm font-semibold text-primary-700 transition hover:border-primary-300"
            >
              <Download size={16} />
              Descargar Manual Operativo (PDF)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
