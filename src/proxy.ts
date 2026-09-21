import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy de Next.js (antes "middleware"):
 * redirige los enlaces de recuperación de contraseña (`?code=`) hacia
 * `/reset-password`.
 *
 * Nota: NO normalizamos aquí el dominio (www vs no-www) porque Vercel ya
 * redirige `cecomro.com` → `www.cecomro.com`; agregar otro redirect causa
 * ERR_TOO_MANY_REDIRECTS.
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
