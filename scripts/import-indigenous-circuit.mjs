import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const pagePath = "/nuestro-trabajo/turismo/circuito-indigena-ro";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: existing, error } = await db.from("simple_pages").select("id").eq("path", pagePath).maybeSingle();
if(error) throw error;
if(existing) throw new Error("La página ya existe; no se reemplazará.");
const folder = path.join(process.env.USERPROFILE, "Downloads", "indigena");
const names = await readdir(folder);
const image = names.filter((name) => /\.(jpe?g|png)$/i.test(name));
const pdf = names.filter((name) => /\.pdf$/i.test(name));
if(image.length !== 1 || pdf.length !== 1) throw new Error("Se esperaba exactamente una imagen y un PDF.");
const client = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
async function upload(name, mime) {
  const body = await readFile(path.join(folder, name));
  const hash = createHash("sha256").update(body).digest("hex").slice(0,20);
  const key = `uploads/circuito-indigena/${hash}-${name.replace(/[^a-zA-Z0-9._-]/g,"-").toLowerCase()}`;
  const url = `${process.env.R2_PUBLIC_URL.replace(/\/$/,"")}/${key}`;
  if(!(await fetch(url, { method: "HEAD" })).ok) await client.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: mime, CacheControl: "public, max-age=31536000, immutable" }));
  if(!(await fetch(url, { method: "HEAD" })).ok) throw new Error(`No accesible: ${name}`);
  const { data, error } = await db.from("media_items").select("id").eq("file_url",url);
  if(error) throw error;
  if(!data.length) {
    const { error } = await db.from("media_items").insert({ title: name, kind: mime === "application/pdf" ? "document" : "image", file_url: url, file_name: name, mime_type: mime, size_bytes: body.length, published_at: new Date().toISOString() });
    if(error) throw error;
  }
  console.log("R2 OK:", name);
  return url;
}
const imageUrl = await upload(image[0], /\.png$/i.test(image[0]) ? "image/png" : "image/jpeg");
const pdfUrl = await upload(pdf[0], "application/pdf");
const download = `/api/download?url=${encodeURIComponent(pdfUrl)}&amp;name=${encodeURIComponent(pdf[0])}`;
const content = `<div class="sp-split"><div><img src="${imageUrl}" alt="Circuito Indígena de la RO" /></div><div><h2>Circuito Indígena de la RO</h2><div class="sp-actions"><a class="sp-btn sp-btn--primary" href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Ver PDF</a><a class="sp-btn sp-btn--outline" href="${download}">Descargar PDF</a></div></div></div>`;
const { data: siblings, error: orderError } = await db.from("simple_pages").select("sort_order").eq("parent_href", "#ejecutados-turismo");
if(orderError) throw orderError;
const sort_order = Math.max(0, ...siblings.map((p) => p.sort_order)) + 1;
const { error: saveError } = await db.from("simple_pages").insert({ title: "Circuito Indígena de la RO", path: pagePath, parent_href: "#ejecutados-turismo", content, sort_order, is_active: true });
if(saveError) throw saveError;
console.log("Página creada y editable en Páginas simples:", pagePath);
