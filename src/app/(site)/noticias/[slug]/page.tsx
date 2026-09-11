import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getCategories, getPostBySlug, getPostFiles, getPostImages } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { DocumentList } from "@/components/site/document-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Noticia" };
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.is_published) notFound();

  const [categories, images, files] = await Promise.all([
    getCategories(),
    getPostImages(post.id),
    getPostFiles(post.id),
  ]);
  const category = categories.find((c) => c.id === post.category_id);

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          {category && (
            <Link
              href={`/noticias/categoria/${category.slug}`}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
            >
              {category.name}
            </Link>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            {formatDate(post.published_at)}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-primary-800 sm:text-4xl">
          {post.title}
        </h1>

        {post.cover_image_url && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="max-h-[420px] w-full object-cover"
            />
          </div>
        )}

        <div
          className="rich-text mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {images.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-primary-800">
              Galería
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={post.title}
                  className="aspect-square w-full rounded-xl border border-line object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-primary-800">
              Documentos
            </h2>
            <DocumentList
              documents={files.map((f) => ({
                id: f.id,
                label: f.file_name,
                file_url: f.file_url,
              }))}
            />
          </div>
        )}

        {post.author && (
          <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
            Publicado por {post.author}
          </p>
        )}
      </div>
    </article>
  );
}
