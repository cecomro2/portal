import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "cecomro.com";

/**
 * Proxy de Next.js (antes "middleware"):
 * 1) Normaliza el dominio: redirige `www.cecomro.com` → `cecomro.com` para que
 *    las cookies/sesión de Supabase (y el código de verificación PKCE) queden
 *    siempre en el mismo dominio.
 * 2) Redirige los enlaces de recuperación de contraseña (`?code=`) hacia
 *    `/reset-password`.
 */
export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // 1. www -> no-www
  if (nextUrl.host === `www.${CANONICAL_HOST}`) {
    const url = nextUrl.clone();
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  // 2. Enlace de recuperación -> /reset-password
  const code = nextUrl.searchParams.get("code");
  if (code && nextUrl.pathname !== "/reset-password") {
    const url = nextUrl.clone();
    url.pathname = "/reset-password";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
