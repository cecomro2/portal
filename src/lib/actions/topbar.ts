"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";

export interface TopbarInput {
  id?: string;
  label: string;
  title: string | null;
  href: string;
  kind: "link" | "social";
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  is_external: boolean;
}

export async function saveTopbarLink(
  input: TopbarInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const payload = {
      label: input.label,
      title: input.title || null,
      href: input.href,
      kind: input.kind,
      icon: input.icon || null,
      sort_order: input.sort_order,
      is_active: input.is_active,
      is_external: input.is_external,
    };
    const { error } = input.id
      ? await supabase.from("topbar_links").update(payload).eq("id", input.id)
      : await supabase.from("topbar_links").insert(payload);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}

export async function deleteTopbarLink(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("topbar_links").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error" };
  }
}
