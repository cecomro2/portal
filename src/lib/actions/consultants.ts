"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface ConsultantInput {
  id?: string;
  name: string;
  specialty: string;
  photo_url: string;
  bio: string;
  sort_order: number;
  is_active: boolean;
}

export async function saveConsultant(
  input: ConsultantInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      name: input.name,
      specialty: input.specialty || null,
      photo_url: input.photo_url || null,
      bio: input.bio || null,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };
    const { error } = input.id
      ? await supabase.from("consultants").update(payload).eq("id", input.id)
      : await supabase.from("consultants").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/red-de-consultores");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteConsultant(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("consultants").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/red-de-consultores");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
