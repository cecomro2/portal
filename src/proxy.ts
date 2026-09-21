import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirige los enlaces de recuperación de contraseña (que llegan con `?code=`)
 * hacia la página dedicada `/reset-password`. Así el enlace funciona aunque el
 * `redirect_to` apunte a la home (por ejemplo, al resetear desde el dashboard
 * de Supabase, que usa el Site URL).
 */
export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const code = nextUrl.searchParams.get("code");

  if (code && nextUrl.pathname !== "/reset-password") {
    const url = nextUrl.clone();
    url.pathname = "/reset-password";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
