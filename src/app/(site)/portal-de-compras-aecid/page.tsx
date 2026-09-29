import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PostingRow } from "@/components/site/posting-row";
import { Reveal } from "@/components/site/reveal";
import { Pagination } from "@/components/site/pagination";
import { getPostings } from "@/lib/data";

export const metadata: Metadata = { title: "Portal de Compras AECID" };

const BASE = "/portal-de-compras-aecid";
const PER_PAGE = 9;

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const postings = await getPostings("procurement");

  const totalPages = Math.max(1, Math.ceil(postings.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pagePostings = postings.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <PageHeader
        kicker="Proyectos de Cooperación"
        title="Portal de Compras AECID"
        subtitle="Procesos de adquisición y licitaciones en el marco de los proyectos de cooperación con AECID."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {pagePostings.length ? (
            <div className="space-y-4">
              {pagePostings.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PostingRow posting={p} basePath={BASE} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              No hay procesos de compra publicados en este momento.
            </p>
          )}

          <Pagination
            current={current}
            totalPages={totalPages}
            basePath={BASE}
          />
        </div>
      </section>
    </>
  );
}
