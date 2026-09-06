"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import { deleteStoredFile } from "@/lib/storage";

export interface MediaInput {
  title: string;
  description?: string;
  kind: "image" | "document" | "video";
  file_url: string;
  file_name: string;
  mime_type?: string;
  size_bytes: number;
  published_at: string;
}

export async function createMediaItem(
  input: MediaInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("media_items").insert({
      title: input.title,
      description: input.description || null,
      kind: input.kind,
      file_url: input.file_url,
      file_name: input.file_name,
      mime_type: input.mime_type || null,
      size_bytes: input.size_bytes,
      published_at: input.published_at || new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/recursos-de-informacion");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteMediaItem(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from("media_items")
      .select("file_url")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase.from("media_items").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    if (data?.file_url) await deleteStoredFile(data.file_url);
    revalidatePath("/recursos-de-informacion");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
