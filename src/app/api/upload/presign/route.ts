import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { createPresignedUpload } from "@/lib/storage";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { fileName, contentType } = await req.json();
    if (!fileName) {
      return Response.json({ error: "Nombre de archivo requerido" }, { status: 400 });
    }

    const type = contentType || "application/octet-stream";
    const { uploadUrl, key, publicUrl } = await createPresignedUpload(
      fileName,
      type,
    );

    // Registrar en la galería de medios de inmediato.
    try {
      const supabase = createServiceSupabase();
      const kind = type.startsWith("image/")
        ? "image"
        : type.startsWith("video/")
          ? "video"
          : "document";
      await supabase.from("media_items").insert({
        title: fileName,
        kind,
        file_url: publicUrl,
        file_name: fileName,
        mime_type: type,
        size_bytes: 0,
        published_at: new Date().toISOString(),
      });
    } catch {
      // No bloquear la subida si falla el registro en la galería.
    }

    return Response.json({ uploadUrl, key, publicUrl, mimeType: type });
  } catch (err) {
    console.error("Error generando presign:", err);
    return Response.json(
      { error: "No se pudo preparar la subida" },
      { status: 500 },
    );
  }
}
