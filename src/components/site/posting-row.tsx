import Link from "next/link";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { postingStatus, stripHtml, timeAgo, formatDate } from "@/lib/utils";
import type { Posting } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PostingRow({
  posting,
  basePath,
}: {
  posting: Posting;
  basePath: string;
}) {
  const status = postingStatus(posting);
  const open = status === "abierta";
  const locations = posting.locations?.length
    ? posting.locations
    : posting.location
      ? [posting.location]
      : [];

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
          {status !== "none" && (
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
          )}
        </div>

        {posting.closing_date && (
          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold",
              open
                ? "bg-accent-500/10 text-accent-600"
                : "bg-gray-100 text-gray-500",
            )}
          >
            <CalendarDays size={13} className="shrink-0" />
            Fecha de cierre: {formatDate(posting.closing_date)}
          </p>
        )}

        {locations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700"
              >
                <MapPin size={11} className="shrink-0" />
                {loc}
              </span>
            ))}
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {stripHtml(posting.description)}
        </p>

        <p className="mt-2 text-xs text-muted">
          Publicado {timeAgo(posting.published_at ?? posting.created_at)}
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
