import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { getPostsByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "CBI",
  description:
    "Programa CBI — noticias e historias de éxito del sector agroexportador.",
};

export default async function CbiPage() {
  const posts = await getPostsByCategory("agro");

  return (
    <>
      <PageHeader
        kicker="Nuestro Trabajo · Proyectos que Impulsamos"
        title="CBI"
        subtitle="Historias de éxito y noticias del sector agroexportador."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.07}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              Aún no hay publicaciones en esta sección.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
