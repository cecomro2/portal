"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

const pagePaths: Record<string, string> = {
  "plan-estrategico": "/nosotros/plan-estrategico",
  "vision-2050": "/nuestro-trabajo/vision-2050",
  educacion: "/nuestro-trabajo/educacion",
  agro: "/nuestro-trabajo/agro",
  turismo: "/nuestro-trabajo/turismo",
  "gestion-territorial": "/nuestro-trabajo/gestion-territorial",
  gobernabilidad: "/nuestro-trabajo/gobernabilidad",
  estudios: "/nuestro-trabajo/estudios",
  cecomce: "/red-de-centros/cecomce",
  cecomcro: "/red-de-centros/cecomcro",
};

export async function savePage(
  input: { slug: string; title: string; content: string },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("site_pages").upsert({
      slug: input.slug,
      title: input.title,
      content: input.content,
      updated_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    if (pagePaths[input.slug]) revalidatePath(pagePaths[input.slug]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
