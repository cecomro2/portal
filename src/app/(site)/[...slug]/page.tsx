import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getSimplePageButtons, getSimplePageByPath } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const page = await getSimplePageByPath(path);
  return { title: page?.title ?? "Página" };
}

export default async function SimplePageRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const page = await getSimplePageByPath(path);
  if (!page) notFound();

  const buttons = await getSimplePageButtons(page.id);

  return (
    <>
      <PageHeader kicker="Cecomro" title={page.title} />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            {/* Texto a la izquierda */}
            <Reveal>
              <div
                className="rich-text text-base leading-relaxed text-ink/80"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </Reveal>

            {/* Botones a la derecha */}
            {buttons.length > 0 && (
              <Reveal delay={0.08}>
                <div className="space-y-3">
                  {buttons.map((b) => {
                    const external = b.href.startsWith("http");
                    if (b.is_download) {
                      return (
                        <a
                          key={b.id}
                          href={b.href}
                          download
                          className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Download size={18} className="text-accent-500" />
                            {b.label}
                          </span>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-muted"
                          />
                        </a>
                      );
                    }
                    if (external) {
                      return (
                        <a
                          key={b.id}
                          href={b.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink size={18} className="text-accent-500" />
                            {b.label}
                          </span>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-muted"
                          />
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={b.id}
                        href={b.href}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                      >
                        <span>{b.label}</span>
                        <ChevronRight
                          size={16}
                          className="shrink-0 text-muted"
                        />
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
