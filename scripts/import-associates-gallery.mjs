import { readdir, readFile, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const folder = path.join(process.env.USERPROFILE, "Downloads", "asociados1");
const names = (await readdir(folder)).filter((name) => /^slide-\d+\.jpg$/i.test(name)).sort((a,b) => a.localeCompare(b, "es", { numeric: true }));
if (names.length !== 10) throw new Error("Se esperaban 10 imágenes ordenadas.");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: existing, error } = await db.from("site_settings").select("*").eq("key", "associates_gallery").maybeSingle();
if (error) throw error;
if (existing) throw new Error("Ya hay una galería guardada. No se sobrescribirá automáticamente.");
const backup = await mkdtemp(path.join(tmpdir(), "cecomro-aliados-"));
await writeFile(path.join(backup, "before.json"), JSON.stringify(existing));
console.log("Respaldo:", backup);
const client = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
const base = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const images = [];
for (const name of names) {
  const body = await readFile(path.join(folder, name));
  const hash = createHash("sha256").update(body).digest("hex").slice(0,20);
  const key = `uploads/asociados/${hash}-${name}`;
  const url = `${base}/${key}`;
  if (!(await fetch(url, { method: "HEAD" })).ok) await client.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: "image/jpeg", CacheControl: "public, max-age=31536000, immutable" }));
  if (!(await fetch(url, { method: "HEAD" })).ok) throw new Error(`No accesible: ${name}`);
  images.push(url);
  const { data, error } = await db.from("media_items").select("id").eq("file_url", url);
  if (error) throw error;
  if (!data.length) {
    const { error } = await db.from("media_items").insert({ title: `Asociados y Aliados ${name}`, kind: "image", file_url: url, file_name: name, mime_type: "image/jpeg", size_bytes: body.length, published_at: new Date().toISOString() });
    if (error) throw error;
  }
  console.log("R2 OK", name);
}
const { error: saveError } = await db.from("site_settings").insert({ key: "associates_gallery", value: JSON.stringify({ images, showIndividual: false }) });
if (saveError) throw saveError;
console.log("Galería guardada: 10 imágenes, orden 01–10. Registros de asociados sin cambios.");
