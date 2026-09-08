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

const CATEGORY_ID = "aa92c2b7-1a31-4a76-8e64-f3b4a2463c37"; // boletin-informativo

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const posts = JSON.parse(readFileSync(new URL("./boletines.json", import.meta.url), "utf8"));

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

async function downloadBuffer(url) {
  const res = await fetch(encodeURI(url), { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadR2(buffer, key, contentType) {
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  return `${R2_PUBLIC_URL}/${key}`;
}

let ok = 0;
let skipped = 0;
let failed = 0;

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const stamp = Date.now().toString(36) + i.toString(36);

  // Saltar entradas completamente vacías (sin imagen ni PDF)
  if (!p.pdf && !(p.ogImage || p.image)) {
    console.log(`SKIP (sin contenido): ${p.title}`);
    skipped++;
    continue;
  }

  try {
    let pdfUrl = null;
    let imgUrl = null;

    if (p.pdf) {
      const buf = await downloadBuffer(p.pdf);
      const key = `uploads/boletines/${slugify(p.title)}-${stamp}.pdf`;
      pdfUrl = await uploadR2(buf, key, "application/pdf");
    }

    const imgSrc = p.ogImage || p.image;
    if (imgSrc) {
      const buf = await downloadBuffer(imgSrc);
      const ext = (imgSrc.match(/\.(png|jpe?g|webp)/i)?.[1] || "jpg").toLowerCase();
      const key = `uploads/boletines/${slugify(p.title)}-${stamp}.${ext}`;
      imgUrl = await uploadR2(buf, key, `image/${ext === "jpg" ? "jpeg" : ext}`);
    }

    const content = pdfUrl
      ? `<p>${p.title}.</p><p><a href="${pdfUrl}" target="_blank" rel="noopener">Descargar boletín en PDF</a></p>`
      : `<p>${p.title}.</p>`;

    const { data: inserted, error } = await sb
      .from("posts")
      .insert({
        title: p.title,
        slug: `${slugify(p.title)}-${stamp}`,
        excerpt: p.title,
        content,
        cover_image_url: imgUrl,
        category_id: CATEGORY_ID,
        published_at: p.date || new Date().toISOString(),
        is_published: true,
        author: "CECOM-RO",
      })
      .select("id")
      .single();

    if (error) {
      console.log(`ERROR post ${p.title}: ${error.message}`);
      failed++;
      continue;
    }

    if (pdfUrl) {
      const { error: fe } = await sb.from("post_files").insert({
        post_id: inserted.id,
        file_name: `${p.title}.pdf`,
        file_url: pdfUrl,
        sort_order: 0,
      });
      if (fe) console.log(`  (aviso archivo) ${p.title}: ${fe.message}`);
    }

    console.log(`OK ${p.title}`);
    ok++;
  } catch (e) {
    console.log(`FAIL ${p.title}: ${e.message}`);
    failed++;
  }
}

console.log(`\n=== Resumen ===\nOK: ${ok} | Saltados: ${skipped} | Fallidos: ${failed}`);
