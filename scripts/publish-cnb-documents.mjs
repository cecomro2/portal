// One-off content import. Run with node --env-file=.env.local scripts/publish-cnb-documents.mjs --apply
import { readFile, readdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const exportsObject = {};
runInNewContext(ts.transpileModule(await readFile("src/lib/simple-page-documents.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject });
const { joinPageDocuments } = exportsObject;
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const apply = process.argv.includes("--apply");
const root = process.env.USERPROFILE;
const temp = await mkdtemp(path.join(tmpdir(), "cecomro-cnb-"));
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const publicBase = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const r2 = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
const { data: backup, error: backupError } = await supabase.from("simple_pages").select("*");
if (backupError) throw backupError;
await writeFile(path.join(temp, "simple-pages-backup.json"), JSON.stringify(backup, null, 2));
console.log("Backup y portadas:", temp);

async function upload(body, name, mime) {
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 20);
  const safeName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const key = `uploads/cnb-circuito/${hash}-${safeName}`;
  const url = `${publicBase}/${key}`;
  if (apply) {
    const existing = await fetch(url, { method: "HEAD" });
    if (!existing.ok) await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: mime, CacheControl: "public, max-age=31536000, immutable" }));
    const check = await fetch(url, { method: "HEAD" });
    if (!check.ok) throw new Error(`No accesible en R2: ${name}`);
    const { data, error } = await supabase.from("media_items").select("id").eq("file_url", url);
    if (error) throw error;
    if (!data.length) {
      const { error } = await supabase.from("media_items").insert({ title: name, kind: mime === "application/pdf" ? "document" : "image", file_url: url, file_name: name, mime_type: mime, size_bytes: body.length, published_at: new Date().toISOString() });
      if (error) throw error;
    }
  }
  return url;
}

async function documents(folder, covers = true) {
  const dir = path.join(root, "Downloads", folder);
  const names = (await readdir(dir)).filter((n) => n.toLowerCase().endsWith(".pdf")).sort((a,b) => a.localeCompare(b, "es"));
  const docs = [];
  for (const name of names) {
    const input = path.join(dir, name);
    execFileSync("pdfinfo", [input], { stdio: "pipe" });
    const doc = { file_name: name.replace(/\.pdf$/i, ""), file_url: await upload(await readFile(input), name, "application/pdf"), mime_type: "application/pdf" };
    if (covers) {
      const prefix = path.join(temp, name.replace(/\.pdf$/i, ""));
      execFileSync("pdftoppm", ["-f", "1", "-singlefile", "-scale-to", "900", "-png", input, prefix], { stdio: "pipe" });
      doc.preview_url = await upload(await readFile(`${prefix}.png`), `${name.slice(0, -4)}-portada.png`, "image/png");
    }
    docs.push(doc);
    console.log("PDF preparado:", name);
  }
  return docs;
}

const cnb = await documents("cnb");
const plans = await documents("drive-download-20261015T031347Z-1-001");
const coffee = await documents("trabajos circuito", false);
if (cnb.length !== 1 || plans.length !== 9 || coffee.length !== 3) throw new Error("Cantidad inesperada de PDF; importación detenida.");
const original = execFileSync("git", ["show", "9984e96:src/app/(site)/nuestro-trabajo/gestion-territorial-aecid/page.tsx"], { encoding: "utf8" });
const declarations = original.slice(original.indexOf("const intro ="), original.indexOf("export default"));
const { intro, more } = runInNewContext(`${declarations};({intro, more})`);
// Place the managed document block after the image, outside the split wrapper so admin parsing is lossless.
const cnbBase = `<div class="sp-split"><div><h2>Desarrollo Integral Territorial en la Comarca Ngäbe Buglé</h2><p>${escape(intro)}</p><details><summary>Leer más</summary>${more.map((p) => `<p>${escape(p)}</p>`).join("")}</details></div><div><img src="/uploads/desarrollo-humano-sostenible.png" alt="Desarrollo Integral Territorial en la Comarca Ngäbe Buglé" /></div></div>`;
const buttons = coffee.map((d) => `<a class="sp-btn sp-btn--outline" href="${escape(d.file_url)}" target="_blank" rel="noopener noreferrer">${escape(d.file_name)}</a>`).join("");
const cafe = `<div class="sp-split"><div><img src="/banner-cafe.png" alt="Circuito del Café" /></div><div><h2>Únete al Circuito del Café</h2><p>Forma parte de la ruta agroturística más destacada de Tierras Altas y Boquete, y accede a los beneficios del circuito.</p><div class="sp-actions"><a class="sp-btn sp-btn--primary" href="https://circuitodelcafe.com/solicitud-de-membresia" target="_blank" rel="noopener noreferrer">SOLICITUD DE MEMBRESÍA CIRCUITO DEL CAFÉ</a><a class="sp-btn sp-btn--outline" href="/api/download?url=${encodeURIComponent('/uploads/Manual-Operativo-del-Circuito-del-Café.pdf')}&amp;name=${encodeURIComponent('Manual-Operativo-del-Circuito-del-Café.pdf')}">Descargar Manual Operativo (PDF)</a></div></div></div><div class="sp-coffee-documents">${buttons}</div>`;
const rows = [
  { title: "Desarrollo Integral CNB", path: "/nuestro-trabajo/gestion-territorial-aecid", parent_href: "#ejecutados-gestion-territorial", sort_order: 1, content: joinPageDocuments(cnbBase, cnb), is_active: true },
  { title: "Planes Estratégicos CNB", path: "/nuestro-trabajo/planes-estrategicos-cnb", parent_href: "#ejecutados-gestion-territorial", sort_order: 2, content: joinPageDocuments("<p>Planes estratégicos de los distritos de la Comarca Ngäbe Buglé.</p>", plans), is_active: true },
  { title: "Circuito del Café", path: "/nuestro-trabajo/turismo/circuito-del-cafe", parent_href: "#ejecutados-turismo", sort_order: 0, content: cafe, is_active: true },
];
for (const row of rows) {
  if (backup.some((p) => p.path === row.path)) throw new Error(`Ya existe ${row.path}; revisar antes de reemplazar contenido.`);
}
await writeFile(path.join(temp, "import-plan.json"), JSON.stringify(rows, null, 2));
// Contact sheet for visual QA of all first-page previews.
const sharp = require("sharp");
const pngs = (await readdir(temp)).filter((n) => n.endsWith(".png"));
const thumbnails = await Promise.all(pngs.map(async (n, i) => ({ input: await sharp(path.join(temp,n)).resize(210,290,{fit:"contain",background:"#eeeeee"}).png().toBuffer(), left: (i % 5)*220, top: Math.floor(i/5)*300 })));
await sharp({ create: { width: 1100, height: Math.ceil(pngs.length/5)*300, channels: 3, background: "#ffffff" } }).composite(thumbnails).png().toFile(path.join(temp,"contact-sheet.png"));
if (apply) {
  const { error } = await supabase.from("simple_pages").insert(rows);
  if (error) throw error;
  console.log("PUBLICADAS 3 páginas. Documentos en R2; contenido editable en Supabase.");
} else console.log("SIMULACIÓN: sin escrituras en R2 ni base de datos. Revisar contact-sheet.png antes de --apply.");
