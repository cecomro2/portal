import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { getSimplePageByPath } from "@/lib/data";

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

  return (
    <>
      <PageHeader kicker="Cecomro" title={page.title} />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div
              className="sp-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
