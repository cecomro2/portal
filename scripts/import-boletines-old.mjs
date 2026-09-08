import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CATEGORY_ID = "aa92c2b7-1a31-4a76-8e64-f3b4a2463c37";

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

// Importar SOLO los posts de 2018-2019 (índices 11+) que quedaron sin PDF/imagen
let ok = 0;
let failed = 0;
for (let i = 11; i < posts.length; i++) {
  const p = posts[i];
  const stamp = Date.now().toString(36) + i.toString(36);
  try {
    const { error } = await sb.from("posts").insert({
      title: p.title,
      slug: `${slugify(p.title)}-${stamp}`,
      excerpt: p.title,
      content: `<p>${p.title}.</p>`,
      cover_image_url: null,
      category_id: CATEGORY_ID,
      published_at: p.date || new Date().toISOString(),
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
