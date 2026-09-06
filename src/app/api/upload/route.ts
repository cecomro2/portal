import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { storeFile } from "@/lib/storage";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Archivo requerido" }, { status: 400 });
    }

    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (file.size > maxSize) {
      return Response.json(
        { error: "El archivo supera el límite de 100 MB" },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storeFile(
      buffer,
      file.name,
      file.type || "application/octet-stream",
    );

    // Registrar el archivo en la galería de medios automáticamente
    // (imágenes, documentos PDF y videos).
    try {
      const supabase = createServiceSupabase();
      const kind = (file.type || "").startsWith("image/")
        ? "image"
        : (file.type || "").startsWith("video/")
          ? "video"
          : "document";
      await supabase.from("media_items").insert({
        title: file.name,
        kind,
        file_url: stored.url,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        published_at: new Date().toISOString(),
      });
    } catch {
      // No bloquear la subida si falla el registro en la galería
    }

    return Response.json({
      url: stored.url,
      key: stored.key,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
    });
  } catch (err) {
    console.error("Error subiendo archivo:", err);
    return Response.json(
      { error: "No se pudo subir el archivo" },
      { status: 500 },
    );
  }
}
