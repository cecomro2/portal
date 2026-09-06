import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anon);

function assertConfigured() {
  if (!url || !anon) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

/** Cliente de servidor (Server Components, Route Handlers, Server Actions). */
export async function createServerSupabase() {
  assertConfigured();
  const cookieStore = await cookies();
  return createServerClient(url!, anon!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // En Server Components las cookies son de solo lectura.
        }
      },
    },
  });
}

/** Cliente público de solo lectura (sin cookies) para consultas en servidor. */
export function createPublicSupabase() {
  assertConfigured();
  return createSupabaseClient(url!, anon!);
}

/** Cliente con service role (solo servidor; omite RLS). */
export function createServiceSupabase() {
  if (!url || !service) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está definido.");
  }
  return createSupabaseClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
