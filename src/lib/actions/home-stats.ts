"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface HomeStatInput {
  id?: string;
  value: string;
  label: string;
  sort_order: number;
}

export async function saveHomeStat(
  input: HomeStatInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      value: input.value,
      label: input.label,
      sort_order: input.sort_order,
    };
    const { error } = input.id
      ? await supabase.from("home_stats").update(payload).eq("id", input.id)
      : await supabase.from("home_stats").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteHomeStat(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("home_stats").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
