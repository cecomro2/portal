"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface HeaderItemInput {
  id?: string;
  title: string;
  subtitle: string | null;
  href: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export async function saveHeaderItem(
  input: HeaderItemInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      title: input.title,
      subtitle: input.subtitle || null,
      href: input.href,
      icon: input.icon || null,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };
    const { error } = input.id
      ? await supabase.from("header_items").update(payload).eq("id", input.id)
      : await supabase.from("header_items").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteHeaderItem(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("header_items").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
