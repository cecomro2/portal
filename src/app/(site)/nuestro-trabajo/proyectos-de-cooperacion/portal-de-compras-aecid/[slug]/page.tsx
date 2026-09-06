import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostingDetail } from "@/components/site/posting-detail";
import { getPostingBySlug, getPostingFiles } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posting = await getPostingBySlug("procurement", slug);
  return { title: posting?.title ?? "Proceso de compra" };
}

export default async function CompraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posting = await getPostingBySlug("procurement", slug);
  if (!posting) notFound();
  const files = await getPostingFiles(posting.id);

  return (
    <PostingDetail
      posting={posting}
      files={files}
      backHref="/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid"
      backLabel="Volver al Portal de Compras AECID"
    />
  );
}
