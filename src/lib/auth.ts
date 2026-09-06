import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | undefined;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin) return null;

    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}
