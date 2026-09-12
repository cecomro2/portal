"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface SimplePageInput {
  id?: string;
  title: string;
  path: string;
  content: string;
  parent_href: string;
  sort_order: number;
  is_active: boolean;
}

export interface SimplePageButtonInput {
  id?: string;
  page_id: string;
  label: string;
  href: string;
  is_download: boolean;
  sort_order: number;
}

export async function saveSimplePage(
  input: SimplePageInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      title: input.title,
      path: input.path,
      content: input.content,
      parent_href: input.parent_href,
      sort_order: input.sort_order,
      is_active: input.is_active,
    };
    const { error } = input.id
      ? await supabase.from("simple_pages").update(payload).eq("id", input.id)
      : await supabase.from("simple_pages").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteSimplePage(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("simple_pages").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function saveSimplePageButton(
  input: SimplePageButtonInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      page_id: input.page_id,
      label: input.label,
      href: input.href,
      is_download: input.is_download,
      sort_order: input.sort_order,
    };
    const { error } = input.id
      ? await supabase
          .from("simple_page_buttons")
          .update(payload)
          .eq("id", input.id)
      : await supabase.from("simple_page_buttons").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteSimplePageButton(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from("simple_page_buttons")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
