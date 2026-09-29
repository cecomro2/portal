"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  current,
  totalPages,
  basePath,
  onPageChange,
}: {
  current: number;
  totalPages: number;
  /** Ruta base para el modo con enlaces (URL `?page=N`). */
  basePath?: string;
  /** Callback para el modo controlado (componentes cliente con estado local). */
  onPageChange?: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (n: number) => {
    const safe = Math.min(Math.max(1, n), totalPages);
    if (!basePath) return "#";
    return safe === 1 ? basePath : `${basePath}?page=${safe}`;
  };

  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;

  const navBtnClass = (disabled: boolean) =>
    cn(
      "inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-300",
      disabled && "pointer-events-none opacity-40",
    );

  const pageClass = (active: boolean) =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition",
      active
        ? "bg-primary-600 text-white"
        : "border border-line bg-white text-muted hover:border-primary-300 hover:text-primary-700",
    );

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {onPageChange ? (
        <button
          type="button"
          onClick={() => onPageChange(current - 1)}
          disabled={prevDisabled}
          className={navBtnClass(prevDisabled)}
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
      ) : (
        <Link
          href={hrefFor(current - 1)}
          aria-disabled={prevDisabled}
          className={navBtnClass(prevDisabled)}
        >
          <ChevronLeft size={16} />
          Anterior
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        onPageChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            aria-current={n === current ? "page" : undefined}
            className={pageClass(n === current)}
          >
            {n}
          </button>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            aria-current={n === current ? "page" : undefined}
            className={pageClass(n === current)}
          >
            {n}
          </Link>
        ),
      )}

      {onPageChange ? (
        <button
          type="button"
          onClick={() => onPageChange(current + 1)}
          disabled={nextDisabled}
          className={navBtnClass(nextDisabled)}
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      ) : (
        <Link
          href={hrefFor(current + 1)}
          aria-disabled={nextDisabled}
          className={navBtnClass(nextDisabled)}
        >
          Siguiente
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
