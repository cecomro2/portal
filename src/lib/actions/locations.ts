"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function saveLocation(
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const clean = name.trim();
    if (!clean) return { ok: false, error: "Nombre requerido." };
    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("locations")
      .upsert({ name: clean }, { onConflict: "name", ignoreDuplicates: true });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteLocation(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
