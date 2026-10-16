import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const paths = [];
const cache = { revalidatePath: (...args) => paths.push(args) };
let fail = false;
let previous = { slug: "noticia-existente" };
const db = { from(table) {
  let operation = "select";
  const query = {
    select() { return query; }, eq() { return query; },
    insert() { operation = "insert"; return query; }, update() { operation = "update"; return query; },
    delete() { operation = "delete"; return query; },
    single() { return Promise.resolve(result()); }, maybeSingle() { return Promise.resolve(result()); },
    then(resolve, reject) { return Promise.resolve(result()).then(resolve, reject); },
  };
  function result() {
    if (fail) return { data: null, error: { message: "fallo simulado" } };
    if (table === "posts") return { data: operation === "insert" ? { id: "new" } : previous, error: null };
    return { data: null, error: null };
  }
  return query;
} };
async function load(file, dependencies) {
  const exportsObject = {};
  runInNewContext(ts.transpileModule(await readFile(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject, require: (name) => {
    if (name in dependencies) return dependencies[name];
    throw new Error(`Dependencia no simulada: ${name}`);
  } });
  return exportsObject;
}
const helpers = await load("src/lib/content-revalidation.ts", { "next/cache": cache });
const deps = { "next/cache": cache, "@/lib/content-revalidation": helpers, "@/lib/supabase/server": { createServiceSupabase: () => db }, "@/lib/utils": { slugify: () => "nueva-noticia" } };
const posts = await load("src/lib/actions/posts.ts", deps);
const visions = await load("src/lib/actions/visions.ts", deps);
const input = { title: "Nueva noticia", content: "Contenido", excerpt: "", cover_image_url: "", category_id: "prensa", published_at: "", is_published: true, author: "", images: [], files: [], videos: [] };
function includes(path, type) { assert.ok(paths.some(([p,t]) => p === path && t === type), `Falta invalidación: ${path} ${type ?? ""}`); }
function newsViews(slug) {
  includes("/"); includes("/noticias"); includes("/busqueda");
  includes("/(site)/noticias/categoria/[slug]", "page"); includes(`/${slug}`);
  assert.ok(!paths.some(([p,t]) => p === "/" && t === "layout"), "Una noticia no debe invalidar todo el sitio");
}
previous = null;
assert.equal((await posts.savePost(input)).ok, true); newsViews("nueva-noticia");
paths.length = 0; previous = { slug: "noticia-existente" };
assert.equal((await posts.savePost({ ...input, id: "existing", category_id: "otra-categoria", is_published: false })).ok, true); newsViews(previous.slug);
paths.length = 0;
assert.equal((await posts.deletePost("existing")).ok, true); newsViews(previous.slug);
paths.length = 0;
assert.equal((await posts.saveCategory({ id: "category", name: "Prensa actualizada" })).ok, true);
includes("/(site)/[slug]", "page"); includes("/(site)/noticias/categoria/[slug]", "page");
paths.length = 0;
assert.equal((await posts.deleteCategory("category")).ok, true); includes("/(site)/[slug]", "page");
paths.length = 0; fail = true;
assert.equal((await posts.deletePost("existing")).ok, false); assert.equal(paths.length, 0);
assert.equal((await posts.savePost({ ...input, id: "existing" })).ok, false); assert.equal(paths.length, 0);
fail = false;
for (const operation of [() => visions.saveVision({ id: "v", title: "Visión", sort_order: 1 }), () => visions.deleteVision("v")]) {
  paths.length = 0; assert.equal((await operation()).ok, true);
  includes("/(site)/vision-pais/[slug]", "page"); includes("/", "layout");
}
for (const operation of [() => visions.saveVisionDocument({ vision_id: "v", label: "Documento", file_url: "https://example.com/a.pdf", sort_order: 1 }), () => visions.deleteVisionDocument("doc")]) {
  paths.length = 0; assert.equal((await operation()).ok, true);
  includes("/vision-pais"); includes("/(site)/vision-pais/[slug]", "page");
  assert.ok(!paths.some(([p,t]) => p === "/" && t === "layout"));
}
// Verifica contra las etiquetas reales de esta versión de Next: los patrones
// deben incluir el grupo (site), no solo la URL pública.
const { getImplicitTags } = require("next/dist/server/lib/implicit-tags.js");
for (const [pattern, pathname] of [["/(site)/noticias/categoria/[slug]", "/noticias/categoria/prensa"], ["/(site)/vision-pais/[slug]", "/vision-pais/vision-2050"], ["/(site)/[slug]", "/noticia-existente"]]) {
  const implicit = await getImplicitTags(`${pattern}/page`, pathname);
  assert.ok(implicit.tags.includes(`_N_T_${pattern}/page`), `El patrón no coincide con las etiquetas de Next: ${pattern}`);
}
const layout = await readFile("src/app/(site)/layout.tsx", "utf8");
assert.ok(layout.includes('dynamic = "force-static"'));
assert.ok(layout.includes("revalidate = 3600"));
console.log("PASS: publicar, editar, despublicar, cambiar categoría, eliminar, visiones/documentos; patrones reales de Next y caché de una hora conservada.");
