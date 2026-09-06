import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { postingStatus, stripHtml, timeAgo } from "@/lib/utils";
import type { Posting } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostingRow({
  posting,
  basePath,
}: {
  posting: Posting;
  basePath: string;
}) {
  const open = postingStatus(posting) === "abierta";

  return (
    <Link
      href={`${basePath}/${posting.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition hover:border-accent-400 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="text-base font-bold text-slate-900 transition group-hover:text-accent-500">
            {posting.title}
          </h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
              open
                ? "bg-emerald-100 text-emerald-800"
                : "bg-gray-200 text-gray-600",
            )}
          >
            {open ? "Convocatoria abierta" : "Cerrada"}
          </span>
        </div>

        {posting.location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={13} className="shrink-0 text-accent-500" />
            {posting.location}
          </p>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {stripHtml(posting.description)}
        </p>

        <p className="mt-2 text-xs text-muted">
          Publicado {timeAgo(posting.created_at)}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-700 transition group-hover:text-accent-500">
        Ver convocatoria
        <ChevronRight
          size={16}
          className="transition group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
