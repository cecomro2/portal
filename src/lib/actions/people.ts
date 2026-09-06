"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface PersonInput {
  id?: string;
  name: string;
  position: string;
  photo_url: string;
  sort_order: number;
  is_active: boolean;
}

const revalidations: Record<"board_members" | "executive_team", string> = {
  board_members: "/nosotros/junta-directiva",
  executive_team: "/nosotros/equipo-ejecutivo",
};

export async function savePerson(
  table: "board_members" | "executive_team",
  input: PersonInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      name: input.name,
      position: input.position,
      photo_url: input.photo_url || null,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };
    const { error } = input.id
      ? await supabase.from(table).update(payload).eq("id", input.id)
      : await supabase.from(table).insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath(revalidations[table]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deletePerson(
  table: "board_members" | "executive_team",
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(revalidations[table]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
