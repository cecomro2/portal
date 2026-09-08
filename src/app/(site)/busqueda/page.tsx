import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { getMediaItems, getPosts, getVisions } from "@/lib/data";
import { flattenNav } from "@/lib/site-config";
import { normalize, searchTerms, stripHtml } from "@/lib/utils";

export const metadata: Metadata = { title: "Buscar" };

export default async function BusquedaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const terms = searchTerms(q);

  const [posts, media, visions] = await Promise.all([
    getPosts(),
    getMediaItems(),
    getVisions(),
  ]);

  const staticPages = [
    ...flattenNav(),
    ...visions.map((v) => ({
      label: v.title,
      href: `/vision-pais/${v.slug}`,
      description: "Visión País 2050",
    })),
    { label: "Visión 2050", href: "/nuestro-trabajo/vision-2050", description: "Visiones Regionales 2050" },
    { label: "Contacto", href: "/contacto", description: "Información de contacto" },
    { label: "Prensa", href: "/noticias/categoria/prensa", description: "Noticias de prensa" },
  ];

  const matches = (hay: string) =>
    terms.length === 0 || terms.every((t) => hay.includes(t));

  const matchedPosts = terms.length
    ? posts.filter((p) =>
        matches(
          normalize(`${p.title} ${p.excerpt ?? ""} ${stripHtml(p.content)}`),
        ),
      )
    : [];

  const matchedMedia = terms.length
    ? media.filter((m) =>
        matches(normalize(`${m.title} ${m.description ?? ""} ${m.file_name}`)),
      )
    : [];

  const matchedPages = terms.length
    ? staticPages.filter((pg) =>
        matches(normalize(`${pg.label} ${pg.description ?? ""}`)),
      )
    : [];

  const total =
    matchedPosts.length + matchedMedia.length + matchedPages.length;

  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Buscar"
        subtitle="Encuentra noticias, documentos, páginas y recursos de información."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form method="get" action="/busqueda" className="relative mx-auto max-w-2xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              key={q}
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Escribe tu búsqueda…"
              className="w-full rounded-xl border border-line bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </form>

          {terms.length > 0 && (
            <p className="mt-6 text-sm text-muted">
              {total} resultado{total !== 1 && "s"} para «{q}»
            </p>
          )}

          {matchedPages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-primary-800">Páginas</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {matchedPages.map((pg) => (
                  <li key={pg.href}>
                    <Link
                      href={pg.href}
                      className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-primary-200"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-primary-800">
                          {pg.label}
                        </p>
                        {pg.description && (
                          <p className="truncate text-sm text-muted">
                            {pg.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs uppercase text-muted">
                        Página
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {matchedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-primary-800">Noticias</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {matchedMedia.length > 0 && (
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

          {terms.length > 0 && total === 0 && (
            <p className="mt-12 rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              No se encontraron resultados para tu búsqueda.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
