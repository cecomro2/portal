import { readFileSync } from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

// --- Cargar variables de .env.local ---
const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const R2_ACCOUNT_ID = env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = env.R2_BUCKET;
const R2_PUBLIC_URL = env.R2_PUBLIC_URL.replace(/\/$/, "");
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const XML_PATH = new URL("../agro/agro cecomro.WordPress.2026-09-11.xml", import.meta.url);

function field(block, tagName) {
  const re = new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`);
  const m = block.match(re);
  return m ? m[1] : "";
}

function plain(block, tagName) {
  const re = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`);
  const m = block.match(re);
  return m ? m[1] : "";
}

function slugify(input) {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toIsoUtc(wpDate) {
  const m = wpDate.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})$/);
  return m ? `${m[1]}T${m[2]}Z` : new Date(wpDate).toISOString();
}

function cleanContent(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+style="[^"]*"/gi, "")
    .replace(/\s+class="[^"]*"/gi, "")
    .replace(/\s+(sizes|srcset|data-[a-z-]+)="[^"]*"/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ");
}

function decodeEntities(str) {
  const map = {
    "&aacute;": "á", "&eacute;": "é", "&iacute;": "í", "&oacute;": "ó", "&uacute;": "ú",
    "&Aacute;": "Á", "&Eacute;": "É", "&Iacute;": "Í", "&Oacute;": "Ó", "&Uacute;": "Ú",
    "&ntilde;": "ñ", "&Ntilde;": "Ñ", "&uuml;": "ü", "&Uuml;": "Ü",
    "&iquest;": "¿", "&iexcl;": "¡", "&ldquo;": "\u201c", "&rdquo;": "\u201d",
    "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&ndash;": "–", "&mdash;": "—",
    "&hellip;": "…", "&bull;": "•",
  };
  return str.replace(/&[a-z]+;/gi, (m) => map[m.toLowerCase()] ?? m);
}

function makeExcerpt(content) {
  const text = decodeEntities(stripTags(content)).replace(/\s+/g, " ").trim();
  return text.length > 180 ? text.slice(0, 180).trimEnd() + "…" : text;
}

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeImageByUrl(html, url) {
  const u = esc(url);
  // <a ...><img src=url ...></a>  →  eliminar todo el bloque
  html = html.replace(new RegExp(`<a\\b[^>]*>\\s*<img\\b[^>]*src=["']${u}["'][^>]*>\\s*</a>`, "gi"), "");
  // <img src=url ...> suelto  →  eliminar
  html = html.replace(new RegExp(`<img\\b[^>]*src=["']${u}["'][^>]*>`, "gi"), "");
  return html;
}

async function downloadBuffer(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadR2(buffer, key, contentType) {
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  return `${R2_PUBLIC_URL}/${key}`;
}

// ---- Parsear XML ----
const xml = readFileSync(XML_PATH, "utf8");
const blocks = xml
  .split(/<item>/)
  .slice(1)
  .map((b) => b.split(/<\/item>/)[0]);

const attachments = new Map();
const posts = [];

// Primera pasada: recopilar todas las URLs de attachments.
for (const b of blocks) {
  if (field(b, "wp:post_type") === "attachment") {
    const url = field(b, "wp:attachment_url");
    if (url) attachments.set(plain(b, "wp:post_id"), url);
  }
}

// Segunda pasada: procesar los posts publicados.
for (const b of blocks) {
  const postType = field(b, "wp:post_type");
  const status = field(b, "wp:status");

  if (postType !== "post") continue;
  if (status !== "publish") {
    console.log(`SKIP (estado ${status || "?"}): ${field(b, "title")}`);
    continue;
  }

  const thumbMatch = b.match(
    /_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/,
  );
  const thumbId = thumbMatch ? thumbMatch[1] : null;

  posts.push({
    title: field(b, "title"),
    slug: field(b, "wp:post_name"),
    content: field(b, "content:encoded"),
    date: toIsoUtc(field(b, "wp:post_date_gmt")) || new Date().toISOString(),
    thumbId,
  });
}

console.log(`\nSe importarán ${posts.length} publicaciones.\n`);

// ---- Buscar categoría agro ----
const { data: cat } = await sb.from("categories").select("id").eq("slug", "agro").maybeSingle();
if (!cat) {
  console.error("ERROR: no se encontró la categoría 'agro' en Supabase.");
  process.exit(1);
}
const CATEGORY_ID = cat.id;

let ok = 0;
let failed = 0;

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const stamp = Date.now().toString(36) + i.toString(36);

  try {
    let content = cleanContent(p.content);

    // Imágenes inline del sitio antiguo (cecomro.com): descargar o eliminar si están caídas
    const urlSet = new Set();
    const urlRe = /(?:src|href)="(https?:\/\/[^"]*cecomro\.com[^"]*)"/gi;
    let m;
    while ((m = urlRe.exec(content)) !== null) urlSet.add(m[1]);

    for (const u of urlSet) {
      try {
        const buf = await downloadBuffer(u);
        const ext = (u.match(/\.(png|jpe?g|webp|gif)/i)?.[1] || "jpg").toLowerCase();
        const key = `uploads/agro/${slugify(p.slug)}-${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const r2url = await uploadR2(buf, key, `image/${ext === "jpg" ? "jpeg" : ext}`);
        content = content.split(u).join(r2url);
        console.log(`  img OK: ${r2url}`);
      } catch (e) {
        content = removeImageByUrl(content, u);
        console.log(`  img caída (eliminada del contenido): ${u}`);
      }
    }

    // Portada (thumbnail)
    let coverUrl = null;
    if (p.thumbId && attachments.has(p.thumbId)) {
      const thumbUrl = attachments.get(p.thumbId);
      try {
        const buf = await downloadBuffer(thumbUrl);
        const ext = (thumbUrl.match(/\.(png|jpe?g|webp|gif)/i)?.[1] || "jpg").toLowerCase();
        const key = `uploads/agro/${slugify(p.slug)}-${stamp}-cover.${ext}`;
        coverUrl = await uploadR2(buf, key, `image/${ext === "jpg" ? "jpeg" : ext}`);
        console.log(`  cover OK: ${coverUrl}`);
      } catch (e) {
        console.log(`  cover caída (sin portada): ${thumbUrl} — ${e.message}`);
      }
    }

    const slug = p.slug || `${slugify(p.title)}-${stamp}`;
    const excerpt = makeExcerpt(content || p.title);

    // Idempotencia: eliminar cualquier post previo con el mismo slug
    await sb.from("posts").delete().eq("slug", slug);

    const { error } = await sb.from("posts").insert({
      title: p.title,
      slug,
      excerpt,
      content,
      cover_image_url: coverUrl,
      category_id: CATEGORY_ID,
      published_at: p.date,
      is_published: true,
      author: "CECOM-RO",
    });

    if (error) throw new Error(error.message);

    console.log(`OK: ${p.title}`);
    ok++;
  } catch (e) {
    console.log(`FAIL: ${p.title} — ${e.message}`);
    failed++;
  }
}

console.log(`\n=== Resumen ===\nOK: ${ok} | Fallidos: ${failed}`);
