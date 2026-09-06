"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface BannerInput {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  cta_label?: string;
  cta_href?: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

export async function saveBanner(
  input: BannerInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      title: input.title,
      subtitle: input.subtitle || null,
      badge: input.badge || null,
      cta_label: input.cta_label || null,
      cta_href: input.cta_href || null,
      image_url: input.image_url,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };

    const { error } = input.id
      ? await supabase.from("banners").update(payload).eq("id", input.id)
      : await supabase.from("banners").insert(payload);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteBanner(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
