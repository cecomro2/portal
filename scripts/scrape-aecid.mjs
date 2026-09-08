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
const CATEGORY_ID = "052bfc81-c6df-4cf3-a37a-58107747fa32"; // prensa-aecid

function stripHtml(s) {
  return (s || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const html = await fetch("https://www.cecomro.com/proyectos-aecid/").then((r) => r.text());

// Extraer items del grid de Visual Composer
const blocks = html.split('<div class="vc_grid-item vc_clearfix');
const posts = [];
for (const b of blocks.slice(1)) {
  const titleM = /post_title"[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/.exec(b);
  const linkM = /href="(https:\/\/www\.cecomro\.com\/[a-z0-9-]+\/)"/.exec(b);
  const imgM = /background-image:\s*url\('([^']+)'\)/.exec(b);
  const excerptM = /post_excerpt"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/.exec(b);
  if (!titleM || !linkM) continue;
  posts.push({
    title: stripHtml(titleM[1]),
    url: linkM[1],
    image: imgM ? imgM[1] : null,
    excerpt: stripHtml(excerptM ? excerptM[1] : ""),
  });
}

console.log(`Posts encontrados en el grid: ${posts.length}`);

let ok = 0;
let failed = 0;
for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const stamp = Date.now().toString(36) + i.toString(36);
  try {
    const detail = await fetch(p.url).then((r) => r.text());
    const ogM = /<meta property="og:image" content="([^"]+)"/.exec(detail);
    const dateM = /"datePublished":"([^"]+)"/.exec(detail);

    let contentHtml = "";
    const ec = /<div class="entry-content"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="post-|<nav|<\/article)/.exec(detail);
    if (ec) contentHtml = ec[1];
    else {
      const wc = /<div class="wpb-content-wrapper">([\s\S]*?)<\/div>\s*<div class="post-/.exec(detail);
      if (wc) contentHtml = wc[1];
    }
    contentHtml = contentHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .trim();

    const excerpt = p.excerpt || stripHtml(contentHtml).slice(0, 240);
    const content = contentHtml
      ? contentHtml
      : `<p>${stripHtml(p.title)}</p>`;

    let imgUrl = null;
    const imgSrc = ogM ? ogM[1] : p.image;
    if (imgSrc) {
      const res = await fetch(encodeURI(imgSrc));
      if (!res.ok) throw new Error(`img HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = (imgSrc.match(/\.(png|jpe?g|webp)/i)?.[1] || "jpg").toLowerCase();
      const key = `uploads/aecid/${slugify(p.title)}-${stamp}.${ext}`;
      await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, Body: buf, ContentType: `image/${ext === "jpg" ? "jpeg" : ext}` }));
      imgUrl = `${R2_PUBLIC_URL}/${key}`;
    }

    const { error } = await sb.from("posts").insert({
      title: p.title,
      slug: `${slugify(p.title)}-${stamp}`,
      excerpt,
      content,
      cover_image_url: imgUrl,
      category_id: CATEGORY_ID,
      published_at: dateM ? dateM[1] : new Date().toISOString(),
      is_published: true,
      author: "CECOM-RO",
    });
    if (error) {
      console.log(`ERROR ${p.title}: ${error.message}`);
      failed++;
    } else {
      console.log(`OK ${p.title}`);
      ok++;
    }
  } catch (e) {
    console.log(`FAIL ${p.title}: ${e.message}`);
    failed++;
  }
}
console.log(`\n=== Resumen ===\nOK: ${ok} | Fallidos: ${failed}`);
