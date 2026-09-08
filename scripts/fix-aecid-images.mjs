import { readFileSync } from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});
const R2_PUBLIC_URL = env.R2_PUBLIC_URL.replace(/\/$/, "");
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Quitar el sufijo de tamaño "-1024x791" de un nombre de archivo
function baseUrl(url) {
  return url.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/i, "");
}

function extOf(url) {
  const m = url.match(/\.(png|jpe?g|webp|gif)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Descargar y subir un original a R2; devuelve la URL R2
async function cacheImage(originalUrl) {
  const res = await fetch(encodeURI(originalUrl));
  if (!res.ok) throw new Error(`HTTP ${res.status} para ${originalUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extOf(originalUrl);
  const base = originalUrl.split("/").pop().replace(/\.\w+$/, "");
  const key = `uploads/aecid/${slugify(base)}-${Date.now().toString(36)}.${ext}`;
  await r2.send(new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    Body: buf,
    ContentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

// Obtener todos los posts que tengan URLs de WordPress en su contenido
const { data: posts, error } = await sb
  .from("posts")
  .select("id, title, content")
  .ilike("content", "%cecomro.com/wp-content/uploads%");

if (error) {
  console.log("Error consultando posts:", error.message);
  process.exit(1);
}

console.log(`Posts a corregir: ${posts?.length ?? 0}`);

for (const post of posts ?? []) {
  const urls = [...new Set((post.content.match(/https:\/\/www\.cecomro\.com\/wp-content\/uploads\/[^"'\s<>]+/gi) || []))];
  if (!urls.length) continue;

  // mapa: url original -> url R2 (por imagen base)
  const baseCache = new Map();
  const replaceMap = new Map();

  for (const url of urls) {
    const base = baseUrl(url);
    if (!baseCache.has(base)) {
      try {
        const r2Url = await cacheImage(base);
        baseCache.set(base, r2Url);
      } catch (e) {
        console.log(`  (no se pudo descargar ${base}: ${e.message})`);
        baseCache.set(base, null);
      }
    }
    const r2Url = baseCache.get(base);
    if (r2Url) replaceMap.set(url, r2Url);
  }

  if (!replaceMap.size) continue;

  let newContent = post.content;
  for (const [wpUrl, r2Url] of replaceMap) {
    newContent = newContent.split(wpUrl).join(r2Url);
  }

  const { error: ue } = await sb.from("posts").update({ content: newContent }).eq("id", post.id);
  if (ue) {
    console.log(`ERROR actualizando ${post.title}: ${ue.message}`);
  } else {
    console.log(`OK ${post.title} (${replaceMap.size} imágenes migradas)`);
  }
}

console.log("\nCompletado.");
