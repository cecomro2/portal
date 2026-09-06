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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Imagen (izquierda) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/banner-cafe.png"
              alt="Circuito del Café"
              className="w-full rounded-2xl border border-line object-cover"
            />

            {/* Botones (derecha) */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-primary-800 sm:text-2xl">
                Únete al Circuito del Café
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                Forma parte de la ruta agroturística más destacada de Tierras
                Altas y Boquete, y accede a los beneficios del circuito.
              </p>

              <a
                href="https://circuitodelcafe.com/solicitud-de-membresia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-primary-700"
              >
                <ExternalLink size={16} />
                SOLICITUD DE MEMBRESÍA CIRCUITO DEL CAFÉ
              </a>

              <a
                href={`/api/download?url=${encodeURIComponent(pdfUrl)}&name=${encodeURIComponent("Manual-Operativo-del-Circuito-del-Café.pdf")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-surface px-5 py-3.5 text-sm font-semibold text-primary-700 transition hover:border-primary-300"
              >
                <Download size={16} />
                Descargar Manual Operativo (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
