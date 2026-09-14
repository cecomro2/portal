export interface UploadedResult {
  url: string;
  mimeType: string;
  fileName: string;
}

/**
 * Sube un archivo directamente a R2 usando una URL prefirmada,
 * evitando el límite de 4.5 MB del body de las funciones serverless.
 */
export async function uploadFile(file: File): Promise<UploadedResult> {
  const contentType = file.type || "application/octet-stream";

  // 1. Obtener URL prefirmada
  const pRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType, size: file.size }),
  });
  const pText = await pRes.text();
  let p: { uploadUrl?: string; publicUrl?: string; error?: string } = {};
  try {
    p = JSON.parse(pText);
  } catch {
    throw new Error("Respuesta inválida al preparar la subida.");
  }
  if (!pRes.ok || !p.uploadUrl) {
    throw new Error(p.error || "Error al preparar la subida.");
  }

  // 2. Subir directamente a R2
  const upRes = await fetch(p.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });
  if (!upRes.ok) {
    throw new Error(`Error al subir el archivo (${upRes.status}).`);
  }

  return {
    url: p.publicUrl!,
    mimeType: contentType,
    fileName: file.name,
  };
}
