"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface VisionInput {
  id?: string;
  title: string;
  sort_order: number;
}

export interface VisionDocumentInput {
  id?: string;
  vision_id: string;
  label: string;
  file_url: string;
  sort_order: number;
}

export async function saveVision(
  input: VisionInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    if (input.id) {
      const { error } = await supabase
        .from("visions")
        .update({ title: input.title, sort_order: input.sort_order })
        .eq("id", input.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
      const { error } = await supabase
        .from("visions")
        .insert({ title: input.title, slug, sort_order: input.sort_order });
      if (error) return { ok: false, error: error.message };
    }
    revalidatePath("/vision-pais");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteVision(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("visions").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/vision-pais");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function saveVisionDocument(
  input: VisionDocumentInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      vision_id: input.vision_id,
      label: input.label,
      file_url: input.file_url,
      sort_order: input.sort_order,
    };
    const { error } = input.id
      ? await supabase
          .from("vision_documents")
          .update(payload)
          .eq("id", input.id)
      : await supabase.from("vision_documents").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/vision-pais");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteVisionDocument(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("vision_documents")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/vision-pais");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
