"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface CommissionInput {
  id?: string;
  name: string;
  description?: string;
  parent_id: string | null;
  sort_order: number;
}

export async function saveCommission(
  input: CommissionInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      name: input.name,
      description: input.description || null,
      parent_id: input.parent_id || null,
      sort_order: input.sort_order,
    };
    const { error } = input.id
      ? await supabase.from("commissions").update(payload).eq("id", input.id)
      : await supabase.from("commissions").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/comisiones-de-trabajo");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteCommission(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("commissions").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/comisiones-de-trabajo");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export interface CommissionMemberInput {
  id?: string;
  commission_id: string;
  name: string;
  photo_url: string | null;
  sort_order: number;
}

export async function saveCommissionMember(
  input: CommissionMemberInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      commission_id: input.commission_id,
      name: input.name,
      photo_url: input.photo_url || null,
      sort_order: input.sort_order,
    };
    const { error } = input.id
      ? await supabase
          .from("commission_members")
          .update(payload)
          .eq("id", input.id)
      : await supabase.from("commission_members").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/comisiones-de-trabajo");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteCommissionMember(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("commission_members")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/nosotros/comisiones-de-trabajo");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
