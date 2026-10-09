import type { PostingType } from "@/lib/types";

export type PostingSection = PostingType | "general_vacancy";

// Namespace persistente: separa las vacantes generales sin cambiar la tabla
// postings ni reclasificar publicaciones AECID existentes.
export const GENERAL_VACANCY_PREFIX = "vacante-general-";

export const POSTING_BASE_PATHS: Record<PostingSection, string> = {
  vacancy: "/vacantes-aecid",
  procurement: "/portal-de-compras-aecid",
  general_vacancy: "/vacantes",
};

export function postingSection(posting: { type: PostingType; slug: string }): PostingSection {
  return posting.type === "vacancy" && posting.slug.startsWith(GENERAL_VACANCY_PREFIX)
    ? "general_vacancy"
    : posting.type;
}

export function postingStorageType(section: PostingSection): PostingType {
  return section === "general_vacancy" ? "vacancy" : section;
}

export function postingStorageSlug(section: PostingSection, slug: string): string {
  return section === "general_vacancy" && !slug.startsWith(GENERAL_VACANCY_PREFIX)
    ? `${GENERAL_VACANCY_PREFIX}${slug}`
    : slug;
}
