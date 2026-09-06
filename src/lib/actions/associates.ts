"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface AssociateInput {
  id?: string;
  name: string;
  logo_url: string;
  type: "asociado" | "aliado";
  website_url: string;
  sort_order: number;
  is_active: boolean;
}

export async function saveAssociate(
  input: AssociateInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      name: input.name,
      logo_url: input.logo_url || null,
      type: input.type,
      website_url: input.website_url || null,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };
    const { error } = input.id
      ? await supabase.from("associates").update(payload).eq("id", input.id)
      : await supabase.from("associates").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/asociados-y-aliados");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteAssociate(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("associates").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/asociados-y-aliados");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
