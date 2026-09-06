import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getAssociates } from "@/lib/data";
import type { Associate } from "@/lib/types";

export const metadata: Metadata = { title: "Asociados y Aliados" };

function AssociateCard({ a }: { a: Associate }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-line bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
      {a.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.logo_url}
          alt={a.name}
          className="h-16 w-16 rounded-lg object-contain"
        />
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-50 text-xl font-bold text-primary-500">
          {a.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <p className="mt-4 text-sm font-semibold text-primary-800">{a.name}</p>
      {a.website_url && (
        <a
          href={a.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-accent-500"
        >
          Sitio web
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

function Group({
  title,
  items,
}: {
  title: string;
  items: Associate[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-xl font-bold text-primary-800">{title}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a, i) => (
          <Reveal key={a.id} delay={(i % 4) * 0.06}>
            <AssociateCard a={a} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default async function AsociadosPage() {
  const associates = await getAssociates();
  const asociados = associates.filter((a) => a.type === "asociado");
  const aliados = associates.filter((a) => a.type === "aliado");

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Asociados y Aliados"
        subtitle="Gremios, empresas, academia, gobiernos locales y agencias de cooperación que forman parte de nuestra red."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {associates.length ? (
            <div className="space-y-12">
              <Group title="Asociados" items={asociados} />
              <Group title="Aliados" items={aliados} />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              El listado de asociados y aliados estará disponible próximamente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
