import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { DocumentList } from "@/components/site/document-list";

export const metadata: Metadata = { title: "Boca Chica" };

export default function BocaChicaPage() {
  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Turismo"
        title="Boca Chica"
        subtitle="Plan de ordenamiento territorial de Boca Chica."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <DocumentList
            documents={[
              {
                id: "piot-boca-chica",
                label: "PIOT-BOCA-CHICA.pdf",
                file_url: "/uploads/PIOT-BOCA-CHICA.pdf",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
