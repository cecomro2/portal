import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/${post.slug}`} aria-label={`Ver publicación: ${post.title}`} className="relative block aspect-[16/10] cursor-pointer overflow-hidden bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-600">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-primary-400">
            <span className="text-2xl font-bold">CECOM-RO</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 text-left">
        <p className="text-xs font-medium text-muted">
          {formatDate(post.published_at)}
        </p>
        <Link href={`/${post.slug}`}>
          <h3 className="mt-2 line-clamp-2 break-words text-left text-base font-semibold leading-snug text-primary-800 group-hover:text-accent-500">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 break-words text-sm text-muted">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4">
          <Link
            href={`/${post.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"
          >
            Ver publicación
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
