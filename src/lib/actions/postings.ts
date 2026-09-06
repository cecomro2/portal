"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface PostingFileInput {
  file_name: string;
  file_url: string;
  mime_type?: string;
}

export interface PostingInput {
  id?: string;
  type: "vacancy" | "procurement";
  title: string;
  description: string;
  apply_info: string;
  closing_date: string | null;
  location: string;
  is_active: boolean;
  files: PostingFileInput[];
}

const revalidations: Record<"vacancy" | "procurement", string[]> = {
  vacancy: [
    "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid",
    "/nuestro-trabajo/proyectos-de-cooperacion",
  ],
  procurement: [
    "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid",
    "/nuestro-trabajo/proyectos-de-cooperacion",
  ],
};

export async function savePosting(
  input: PostingInput,
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  try {
    const supabase = createServiceSupabase();
    const base = {
      type: input.type,
      title: input.title,
      description: input.description,
      apply_info: input.apply_info || null,
      closing_date: input.closing_date || null,
      location: input.location || null,
      is_active: input.is_active,
      updated_at: new Date().toISOString(),
    };

    let id = input.id;
    let slug: string | undefined;

    if (id) {
      const { error } = await supabase
        .from("postings")
        .update(base)
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      const { data: existing } = await supabase
        .from("postings")
        .select("slug")
        .eq("id", id)
        .single();
      slug = existing?.slug;
    } else {
      slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
      const { data: inserted, error } = await supabase
        .from("postings")
        .insert({ ...base, slug })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      id = inserted.id;
    }

    // Reemplazar archivos adjuntos
    await supabase.from("posting_files").delete().eq("posting_id", id);
    if (input.files.length) {
      await supabase.from("posting_files").insert(
        input.files.map((f, i) => ({
          posting_id: id,
          file_name: f.file_name,
          file_url: f.file_url,
          mime_type: f.mime_type || null,
          sort_order: i,
        })),
      );
    }

    revalidations[input.type].forEach((p) => revalidatePath(p));
    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deletePosting(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from("postings")
      .select("type")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase.from("postings").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    if (data?.type) revalidations[data.type as "vacancy" | "procurement"]?.forEach((p) => revalidatePath(p));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
