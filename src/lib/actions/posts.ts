"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface PostInput {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string | null;
  published_at: string;
  is_published: boolean;
  author: string;
  images: { image_url: string }[];
  files: { file_name: string; file_url: string }[];
}

export async function savePost(
  input: PostInput,
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  try {
    const supabase = createServiceSupabase();
    const base = {
      title: input.title,
      excerpt: input.excerpt || null,
      content: input.content,
      cover_image_url: input.cover_image_url || null,
      category_id: input.category_id || null,
      published_at: input.published_at || new Date().toISOString(),
      is_published: input.is_published,
      author: input.author || null,
      updated_at: new Date().toISOString(),
    };

    let id = input.id;
    let slug: string | undefined;
    if (input.id) {
      const { error } = await supabase
        .from("posts")
        .update(base)
        .eq("id", input.id);
      if (error) return { ok: false, error: error.message };
      const { data } = await supabase
        .from("posts")
        .select("slug")
        .eq("id", input.id)
        .single();
      slug = data?.slug;
    } else {
      slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
      const { data: inserted, error } = await supabase
        .from("posts")
        .insert({ ...base, slug })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      id = inserted.id;
    }

    // Reemplazar galería de imágenes
    await supabase.from("post_images").delete().eq("post_id", id);
    if (input.images.length) {
      await supabase.from("post_images").insert(
        input.images.map((img, i) => ({
          post_id: id,
          image_url: img.image_url,
          sort_order: i,
        })),
      );
    }

    // Reemplazar documentos PDF
    await supabase.from("post_files").delete().eq("post_id", id);
    if (input.files.length) {
      await supabase.from("post_files").insert(
        input.files.map((f, i) => ({
          post_id: id,
          file_name: f.file_name,
          file_url: f.file_url,
          sort_order: i,
        })),
      );
    }

    revalidatePath("/noticias");
    revalidatePath("/");
    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deletePost(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/noticias");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function saveCategory(
  input: { id?: string; name: string },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    if (input.id) {
      const { error } = await supabase
        .from("categories")
        .update({ name: input.name })
        .eq("id", input.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase
        .from("categories")
        .insert({ name: input.name, slug: slugify(input.name) });
      if (error) return { ok: false, error: error.message };
    }
    revalidatePath("/noticias");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteCategory(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/noticias");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
