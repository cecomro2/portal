"use server";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { ECOSYSTEM_KEY, GALLERY_KEY, isWebUrl, type EcosystemItem, type AssociatesGallery } from "@/lib/ecosystem";

async function persist(key: string, value: unknown) {
  const { error } = await createServiceSupabase().from("site_settings").upsert({ key, value: JSON.stringify(value) });
  if (error) throw new Error(error.message);
}
export async function saveEcosystem(items: EcosystemItem[]) {
  try {
    if (!(await getCurrentAdmin())) return { ok: false, error: "No autorizado." };
    if (!Array.isArray(items) || items.length > 100 || items.some((i) => !i || typeof i.id !== "string" || typeof i.name !== "string" || !i.name.trim() || typeof i.description !== "string" || typeof i.active !== "boolean" || typeof i.url !== "string" || (i.url !== "" && !isWebUrl(i.url))) || new Set(items.map((i) => i.id)).size !== items.length) {
      return { ok: false, error: "Revisa los nombres y enlaces. La URL puede quedar vacía; si la agregas, debe ser http o https." };
    }
    await persist(ECOSYSTEM_KEY, items.map((i) => ({ ...i, name: i.name.trim(), description: i.description.trim(), url: i.url.trim() })));
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "No se pudo guardar." }; }
}
export async function saveAssociatesGallery(gallery: AssociatesGallery) {
  try {
    if (!(await getCurrentAdmin())) return { ok: false, error: "No autorizado." };
    if (!gallery || typeof gallery.showIndividual !== "boolean" || !Array.isArray(gallery.images) || gallery.images.length > 200 || gallery.images.some((u) => typeof u !== "string" || !(isWebUrl(u) || /^\/(?!\/)/.test(u)))) return { ok: false, error: "Galería inválida." };
    await persist(GALLERY_KEY, gallery);
    revalidatePath("/nosotros/asociados-y-aliados");
    return { ok: true };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "No se pudo guardar." }; }
}
