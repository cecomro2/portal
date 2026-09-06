import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { DocumentList } from "@/components/site/document-list";

export const metadata: Metadata = { title: "Síntesis Diagnósticos Provinciales" };

const titles = [
  "Síntesis Diagnóstica Preliminar Visión Colón 2040",
  "Síntesis Diagnóstica Preliminar Visión Coclé 2040",
  "Síntesis Diagnóstica Preliminar Visión Veraguas 2040",
  "Síntesis Diagnóstica Preliminar Visión Ngäbe Buglé 2040",
  "Síntesis Diagnóstica Preliminar Visión Chiriquí 2040",
  "Síntesis Diagnóstica Preliminar Visión Bocas del Toro 2040",
];

export default function SintesisDiagnosticosPage() {
  const documents = titles.map((t, i) => ({
    id: `sd-${i}`,
    label: t,
    file_url: "/uploads/demo/sintesis-diagnostica.pdf",
  }));

  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Gobernabilidad"
        title="Síntesis Diagnósticos Provinciales"
        subtitle="Documentos de diagnóstico preliminar de las visiones provinciales 2040."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <DocumentList documents={documents} />
        </div>
      </section>
    </>
  );
}
