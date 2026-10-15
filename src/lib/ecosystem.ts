export interface EcosystemItem { id: string; name: string; description: string; url: string; active: boolean }
export const ECOSYSTEM_KEY = "ecosystem_items";
export const GALLERY_KEY = "associates_gallery";
export const DEFAULT_ECOSYSTEM: EcosystemItem[] = [
  { id: "cipar", name: "CIPAR-AIP", description: "Centro de Investigación para la Producción Agropecuaria Resiliente de la Región Occidental", url: "", active: true },
  { id: "cipac", name: "CIPAC-AIP", description: "Centro de Investigación y Producción en Ambiente Controlado", url: "https://www.cipac.org.pa/", active: true },
  { id: "ceagro", name: "CEAGRO AIP", description: "Centro de Especialidades Agropecuarias", url: "https://www.ceagroaip.org.pa/", active: true },
  { id: "crivb", name: "CRIVB AIP", description: "Centro Regional de Innovación en Vacunas y Biofármacos", url: "https://crivb.org.pa/", active: true },
  { id: "aei", name: "AEI Panamá", description: "Alianza para el Emprendimiento e Innovación de Panamá", url: "https://www.aei.org.pa/", active: true },
];
export function isWebUrl(value: string): boolean {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
export function parseEcosystem(raw: string | null): EcosystemItem[] {
  if (raw === null) return DEFAULT_ECOSYSTEM;
  try {
    const items: EcosystemItem[] = JSON.parse(raw);
    if (!Array.isArray(items) || items.some((i) => !i || typeof i.id !== "string" || typeof i.name !== "string" || typeof i.description !== "string" || typeof i.url !== "string" || typeof i.active !== "boolean")) return [];
    return items;
  } catch { return []; }
}
export function visibleEcosystem(items: EcosystemItem[]) { return items.filter((i) => i.active && i.name.trim() && (!i.url || isWebUrl(i.url))); }
export interface AssociatesGallery { images: string[]; showIndividual: boolean }
export function parseAssociatesGallery(raw: string | null): AssociatesGallery {
  try {
    const data = JSON.parse(raw ?? "{}");
    return { images: Array.isArray(data.images) ? data.images.filter((u: unknown) => typeof u === "string" && (isWebUrl(u) || /^\/(?!\/)/.test(u))) : [], showIndividual: data.showIndividual === true };
  } catch { return { images: [], showIndividual: false }; }
}
