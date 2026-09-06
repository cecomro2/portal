import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { getMediaItems, getPosts } from "@/lib/data";
import { stripHtml } from "@/lib/utils";

export const metadata: Metadata = { title: "Buscar" };

export default async function BusquedaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const [posts, media] = await Promise.all([getPosts(), getMediaItems()]);

  const matchedPosts = query
    ? posts.filter((p) =>
        [p.title, p.excerpt, stripHtml(p.content)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];

  const matchedMedia = query
    ? media.filter((m) =>
        [m.title, m.description, m.file_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];

  const total = matchedPosts.length + matchedMedia.length;

  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Buscar"
        subtitle="Encuentra noticias, documentos y recursos de información."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form method="get" action="/busqueda" className="relative mx-auto max-w-2xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Escribe tu búsqueda…"
              className="w-full rounded-xl border border-line bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </form>

          {query && (
            <p className="mt-6 text-sm text-muted">
              {total} resultado{total !== 1 && "s"} para «{q}»
            </p>
          )}

          {query && matchedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-primary-800">Noticias</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {query && matchedMedia.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-primary-800">
                Recursos de información
              </h2>
              <ul className="mt-4 space-y-3">
                {matchedMedia.map((m) => (
                  <li key={m.id}>
                    <Link
                      href="/recursos-de-informacion"
                      className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-primary-200"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-primary-800">
                          {m.title}
                        </p>
                        {m.description && (
                          <p className="truncate text-sm text-muted">
                            {m.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs uppercase text-muted">
                        {m.kind === "image"
                          ? "Imagen"
                          : m.kind === "video"
                            ? "Video"
                            : "Documento"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query && total === 0 && (
            <p className="mt-12 rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              No se encontraron resultados para tu búsqueda.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
