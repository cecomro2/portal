"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { getCurrentAdmin } from "@/lib/auth";
import { GENERAL_VACANCY_PREFIX, POSTING_BASE_PATHS, postingSection, postingStorageSlug, postingStorageType, type PostingSection } from "@/lib/posting-sections";
import type { Posting } from "@/lib/types";

export interface PostingFileInput {
  file_name: string;
  file_url: string;
  mime_type?: string;
}

export interface PostingInput {
  id?: string;
  type: PostingSection;
  title: string;
  slug: string;
  description: string;
  apply_info: string;
  closing_date: string | null;
  location: string;
  category_id: string | null;
  locations: string[];
  apply_emails: string[];
  published_at: string | null;
  status: "open" | "closed" | "none";
  files: PostingFileInput[];
  images: { image_url: string }[];
}

const revalidations: Record<PostingSection, string[]> = {
  general_vacancy: ["/vacantes"],
  vacancy: [
    "/vacantes-aecid",
    "/proyectos-aecid",
  ],
  procurement: [
    "/portal-de-compras-aecid",
    "/proyectos-aecid",
  ],
};

export async function savePosting(
  input: PostingInput,
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  try {
    if (!(await getCurrentAdmin())) return { ok: false, error: "No autorizado." };
    if (!Object.hasOwn(POSTING_BASE_PATHS, input.type)) return { ok: false, error: "Sección inválida." };
    const supabase = createServiceSupabase();
    let previous: Pick<Posting, "type" | "slug"> | null = null;
    if (input.id) {
      const { data, error } = await supabase.from("postings").select("type, slug").eq("id", input.id).single();
      if (error || !data) return { ok: false, error: "Publicación no encontrada." };
      previous = data as Pick<Posting, "type" | "slug">;
      if (postingSection(previous) !== input.type) return { ok: false, error: "La publicación pertenece a otra sección." };
    }
    const base = {
      type: postingStorageType(input.type),
      title: input.title,
      description: input.description,
      apply_info: input.apply_info || null,
      closing_date: input.closing_date || null,
      location: input.location || null,
      category_id: input.category_id || null,
      locations: input.locations || [],
      apply_emails: input.apply_emails || [],
      published_at: input.published_at || new Date().toISOString().slice(0, 10),
      status: input.status || "open",
      is_active: input.status !== "closed",
      updated_at: new Date().toISOString(),
    };

    let id = input.id;
    let slug = input.slug?.trim() || "";
    if (slug) slug = postingStorageSlug(input.type, slugify(slug));

    if (!slug) {
      // Slug limpio, sin sufijo aleatorio; si colisiona, se numera (-2, -3, …)
      const slugBase = postingStorageSlug(input.type, slugify(input.title) || "publicacion");
      slug = slugBase;
      let n = 2;
      while (true) {
        const { data: existing, error } = await supabase
          .from("postings")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (error) return { ok: false, error: error.message };
        if (!existing || existing.id === id) break;
        slug = `${slugBase}-${n}`;
        n += 1;
      }
    }

    if (input.type === "vacancy" && slug.startsWith(GENERAL_VACANCY_PREFIX)) {
      return { ok: false, error: "Ese identificador está reservado para las vacantes generales." };
    }

    if (id) {
      const { error } = await supabase
        .from("postings")
        .update({ ...base, slug })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
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

    // Reemplazar imágenes
    await supabase.from("posting_images").delete().eq("posting_id", id);
    if (input.images.length) {
      await supabase.from("posting_images").insert(
        input.images.map((img, i) => ({
          posting_id: id,
          image_url: img.image_url,
          sort_order: i,
        })),
      );
    }

    // Registrar ubicaciones nuevas en la lista reutilizable (on-the-fly)
    for (const name of input.locations || []) {
      const clean = name.trim();
      if (!clean) continue;
      await supabase
        .from("locations")
        .upsert({ name: clean }, { onConflict: "name", ignoreDuplicates: true });
    }

    revalidations[input.type].forEach((p) => revalidatePath(p));
    revalidatePath(`${POSTING_BASE_PATHS[input.type]}/${slug}`);
    if (previous && previous.slug !== slug) revalidatePath(`${POSTING_BASE_PATHS[input.type]}/${previous.slug}`);
    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deletePosting(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await getCurrentAdmin())) return { ok: false, error: "No autorizado." };
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from("postings")
      .select("type, slug")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabase.from("postings").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    if (data) {
      const section = postingSection(data as Pick<Posting, "type" | "slug">);
      revalidations[section].forEach((p) => revalidatePath(p));
      revalidatePath(`${POSTING_BASE_PATHS[section]}/${data.slug}`);
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
