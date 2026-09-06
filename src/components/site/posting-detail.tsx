import Link from "next/link";
import { ArrowLeft, CalendarDays, Info, MapPin } from "lucide-react";
import { formatDate, postingStatus } from "@/lib/utils";
import type { Posting, PostingFile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DocumentList } from "@/components/site/document-list";

export function PostingDetail({
  posting,
  files,
  backHref,
  backLabel,
}: {
  posting: Posting;
  files: PostingFile[];
  backHref: string;
  backLabel: string;
}) {
  const open = postingStatus(posting) === "abierta";

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-accent-500"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              open
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {open ? "Convocatoria abierta" : "Convocatoria cerrada"}
          </span>
          {posting.closing_date && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays size={15} />
              Fecha de cierre: {formatDate(posting.closing_date)}
            </span>
          )}
          {posting.location && (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={15} className="text-accent-500" />
              {posting.location}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-primary-800 sm:text-4xl">
          {posting.title}
        </h1>

        {/* Descripción */}
        <div
          className="rich-text mt-8"
          dangerouslySetInnerHTML={{ __html: posting.description }}
        />

        {/* Documentos */}
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

        {/* Información para aplicar */}
        {open && posting.apply_info ? (
          <div className="mt-10 rounded-xl border border-primary-200 bg-primary-50 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-800">
              <Info size={20} className="text-primary-600" />
              Cómo aplicar
            </h2>
            <div className="rich-text mt-3">{posting.apply_info}</div>
          </div>
        ) : (
          !open && (
            <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-muted">
              Esta convocatoria ha cerrado y la información para aplicar ya no
              está disponible.
            </div>
          )
        )}
      </div>
    </section>
  );
}
