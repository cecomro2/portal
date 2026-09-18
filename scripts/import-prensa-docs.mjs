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
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const R2_PUBLIC_URL = env.R2_PUBLIC_URL.replace(/\/$/, "");

const FILES = [
  new URL("../blog prensa/cecomro.WordPress.2026-09-18.xml", import.meta.url),
  new URL("../blog prensa/cecomro.WordPress.2026-09-18 (1).xml", import.meta.url),
];

function field(block, tag) {
  const re = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const m = block.match(re);
  return m ? m[1] : "";
}
function plain(block, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = block.match(re);
  return m ? m[1] : "";
}

const DOC_RE = /\.(pdf|pptx?|docx?|xlsx?)(?:\?|$)/i;
const postIdToSlug = new Map();
const docs = []; // { url, name, parentPostId }

for (const file of FILES) {
  const xml = readFileSync(file, "utf8");
  const blocks = xml.split(/<item>/).slice(1).map((b) => b.split(/<\/item>/)[0]);
  for (const b of blocks) {
    const type = field(b, "wp:post_type");
    const id = plain(b, "wp:post_id");
    if (type === "post") {
      postIdToSlug.set(id, field(b, "wp:post_name"));
    } else if (type === "attachment") {
      const url = field(b, "wp:attachment_url");
      if (url && DOC_RE.test(url)) {
        docs.push({ url, name: field(b, "title"), parentPostId: plain(b, "wp:post_parent") });
      }
    }
  }
}

// También PDFs referenciados dentro del contenido (shortcodes)
for (const file of FILES) {
  const xml = readFileSync(file, "utf8");
  const blocks = xml.split(/<item>/).slice(1).map((b) => b.split(/<\/item>/)[0]);
  for (const b of blocks) {
    if (field(b, "wp:post_type") !== "post") continue;
    const content = field(b, "content:encoded");
    const re = /(https?:\/\/[^"'\s\[\]]+\.(?:pdf|pptx?|docx?|xlsx?))/gi;
    let m;
    while ((m = re.exec(content)) !== null) {
      const url = m[1];
      if (!docs.some((d) => d.url === url)) {
        docs.push({ url, name: url.split("/").pop(), parentPostId: plain(b, "wp:post_id") });
      }
    }
  }
}

console.log(`Documentos encontrados: ${docs.length}\n`);

async function downloadBuffer(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

let ok = 0, failed = 0, noPost = 0;

for (let i = 0; i < docs.length; i++) {
  const d = docs[i];
  const slug = postIdToSlug.get(d.parentPostId);
  if (!slug) {
    console.log(`SIN POST: ${d.name} (parent ${d.parentPostId})`);
    noPost++;
    continue;
  }
  // Buscar el post importado por slug
  const { data: post } = await sb.from("posts").select("id,title").eq("slug", slug).maybeSingle();
  if (!post) {
    console.log(`POST NO ENCONTRADO: ${d.name} (slug ${slug})`);
    noPost++;
    continue;
  }
  try {
    const buf = await downloadBuffer(d.url);
    const ext = (d.url.match(/\.(pdf|pptx?|docx?|xlsx?)(?:\?|$)/i)?.[1] || "pdf").toLowerCase();
    const key = `uploads/prensa/docs/${Date.now().toString(36)}-${i}-${encodeURIComponent((d.name || "documento").replace(/[^\w.-]+/g, "-")).slice(0, 60)}.${ext}`;
    const r2url = `${R2_PUBLIC_URL}/${key}`;
    await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, Body: buf, ContentType: "application/octet-stream" }));
    await sb.from("post_files").insert({
      post_id: post.id,
      file_name: d.name || `Documento.${ext}`,
      file_url: r2url,
      sort_order: 0,
    });
    console.log(`OK: ${d.name} -> ${post.title}`);
    ok++;
  } catch (e) {
    console.log(`FAIL: ${d.name} — ${e.message}`);
    failed++;
  }
}

console.log(`\n=== Resumen ===\nOK: ${ok} | Fallidos: ${failed} | Sin post: ${noPost}`);
