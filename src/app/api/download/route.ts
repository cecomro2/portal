import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Descarga un archivo forzando `Content-Disposition: attachment`.
 * Solo permite archivos de nuestro propio almacenamiento (local /uploads o R2).
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const name = req.nextUrl.searchParams.get("name") ?? "archivo";

  if (!url) {
    return new Response("Parámetro 'url' requerido", { status: 400 });
  }

  const r2Base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

  const isLocal = url.startsWith("/");
  const isR2 = Boolean(r2Base && url.startsWith(r2Base));

  if (!isLocal && !isR2) {
    return new Response("No permitido", { status: 403 });
  }

  try {
    let body: Buffer;
    let contentType = "application/octet-stream";

    if (isLocal) {
      const filePath = path.join(process.cwd(), "public", url.slice(1));
      body = await readFile(filePath);
      contentType = guessContentType(url);
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      body = Buffer.from(await res.arrayBuffer());
      contentType = res.headers.get("content-type") ?? contentType;
    }

    const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(name)}`;

    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("No se pudo descargar el archivo", { status: 404 });
  }
}

function guessContentType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}
