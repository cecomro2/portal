import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { Pagination } from "@/components/site/pagination";
import { getCategories, getPosts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Noticias" };

const PER_PAGE = 9;

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pagePosts = posts.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Noticias"
        subtitle="Novedades, comunicados y actualidad del CECOMRO."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categories.length > 0 && (
            <Reveal>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/noticias"
                  className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Todas
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/noticias/categoria/${c.slug}`}
                    className={cn(
                      "rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-700",
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {pagePosts.length ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.07}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              No hay noticias publicadas por el momento.
            </p>
          )}

          <Pagination
            current={current}
            totalPages={totalPages}
            basePath="/noticias"
          />
        </div>
      </section>
    </>
  );
}
