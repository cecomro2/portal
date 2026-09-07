"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PostingRow } from "@/components/site/posting-row";
import type { Posting } from "@/lib/types";
import { normalize, searchTerms, stripHtml } from "@/lib/utils";

export function VacancyList({
  postings,
  basePath,
}: {
  postings: Posting[];
  basePath: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const filtered = useMemo(() => {
    const terms = searchTerms(query);
    const list = postings.filter((p) => {
      if (terms.length) {
        const hay = normalize(
          `${p.title} ${p.location ?? ""} ${stripHtml(p.description)}`,
        );
        if (!terms.every((t) => hay.includes(t))) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sort === "desc" ? tb - ta : ta - tb;
    });
  }, [postings, query, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar vacante por cargo, ubicación…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "desc" | "asc")}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary-400"
        >
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguas</option>
        </select>
      </div>

      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((p) => (
            <PostingRow key={p.id} posting={p} basePath={basePath} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
          {postings.length
            ? "No hay vacantes que coincidan con tu búsqueda."
            : "No hay vacantes publicadas en este momento."}
        </p>
      )}
    </div>
  );
}
