import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/posting-sections.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const sectionModule = { exports: {} };
new Function("exports", "module", "require", compiled)(sectionModule.exports, sectionModule, createRequire(import.meta.url));
const { postingSection, postingStorageSlug, postingStorageType, POSTING_BASE_PATHS } = sectionModule.exports;

const records = [
  { type: "vacancy", slug: "ingeniero-aecid" },
  { type: "vacancy", slug: "vacante-general-ingeniero" },
  { type: "procurement", slug: "vacante-general-licitacion" },
];
for (const [index, section] of ["vacancy", "general_vacancy", "procurement"].entries()) {
  assert.equal(postingSection(records[index]), section);
  assert.deepEqual(records.filter((record) => postingSection(record) === section), [records[index]]);
}
assert.equal(postingStorageType("general_vacancy"), "vacancy");
assert.equal(postingStorageSlug("general_vacancy", "ingeniero"), "vacante-general-ingeniero");
assert.equal(postingStorageSlug("general_vacancy", "vacante-general-ingeniero"), "vacante-general-ingeniero");
assert.equal(postingStorageSlug("vacancy", "ingeniero-aecid"), "ingeniero-aecid");
assert.equal(POSTING_BASE_PATHS.general_vacancy, "/vacantes");
console.log("PASS: listados y detalles aislados; namespace estable al editar; enlaces AECID preservados.");

// Ejecutar las acciones reales con una base en memoria: ninguna escritura en
// producción. Verifica CRUD y revalidación sin publicar vacantes de prueba.
let authenticated = true;
let sequence = 0;
const tables = { postings: [{ id: "aecid", type: "vacancy", slug: "ingeniero-aecid", title: "AECID" }], posting_files: [], posting_images: [], locations: [] };
const originalAecid = structuredClone(tables.postings[0]);
const invalidated = [];
const db = {
  from(table) {
    let operation = "select";
    let values;
    const filters = [];
    const execute = async () => {
      const matching = tables[table].filter((row) => filters.every(([key, value]) => row[key] === value));
      if (operation === "insert") {
        const rows = (Array.isArray(values) ? values : [values]).map((row) => ({ id: `new-${++sequence}`, ...row }));
        tables[table].push(...rows);
        return { data: rows, error: null };
      }
      if (operation === "update") matching.forEach((row) => Object.assign(row, values));
      if (operation === "delete") tables[table] = tables[table].filter((row) => !matching.includes(row));
      return { data: matching, error: null };
    };
    const query = {
      select() { return query; },
      eq(key, value) { filters.push([key, value]); return query; },
      insert(input) { operation = "insert"; values = input; return query; },
      update(input) { operation = "update"; values = input; return query; },
      delete() { operation = "delete"; return query; },
      upsert(input) { operation = "insert"; values = input; return query; },
      async single() { const result = await execute(); return { ...result, data: result.data[0] ?? null }; },
      async maybeSingle() { return query.single(); },
      then(resolve, reject) { return execute().then(resolve, reject); },
    };
    return query;
  },
};
const actionSource = readFileSync(new URL("../src/lib/actions/postings.ts", import.meta.url), "utf8");
const actionModule = { exports: {} };
const mocks = {
  "next/cache": { revalidatePath: (path) => invalidated.push(path) },
  "@/lib/supabase/server": { createServiceSupabase: () => db },
  "@/lib/auth": { getCurrentAdmin: async () => authenticated ? { id: "admin" } : null },
  "@/lib/utils": { slugify: (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  "@/lib/posting-sections": sectionModule.exports,
};
new Function("exports", "module", "require", ts.transpileModule(actionSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText)(actionModule.exports, actionModule, (id) => {
  assert.ok(id in mocks, `Unexpected dependency: ${id}`);
  return mocks[id];
});
const { savePosting, deletePosting } = actionModule.exports;
const input = { type: "general_vacancy", title: "Ingeniero", slug: "", description: "Descripción", apply_info: "Aplicar", closing_date: null, location: "", category_id: null, locations: [], apply_emails: ["prueba@example.com"], published_at: "2026-10-09", status: "open", files: [{ file_name: "bases.pdf", file_url: "https://example.com/bases.pdf" }], images: [{ image_url: "https://example.com/imagen.jpg" }] };
const saved = await savePosting(input);
assert.equal(saved.ok, true);
assert.equal(saved.slug, "vacante-general-ingeniero");
const created = tables.postings.find((row) => row.slug === saved.slug);
assert.equal(created.type, "vacancy");
assert.equal(tables.posting_files[0].posting_id, created.id);
assert.equal(tables.posting_images[0].posting_id, created.id);
assert.ok(invalidated.includes("/vacantes"));
assert.ok(invalidated.includes(`/vacantes/${saved.slug}`));
assert.equal(invalidated.includes("/vacantes-aecid"), false);
const edited = await savePosting({ ...input, id: created.id, slug: "ingeniero-nuevo" });
assert.equal(edited.ok, true);
assert.equal(edited.slug, "vacante-general-ingeniero-nuevo");
assert.equal((await savePosting({ ...input, id: "aecid" })).ok, false);
assert.equal((await savePosting({ ...input, type: "vacancy", slug: saved.slug })).ok, false);
authenticated = false;
assert.equal((await savePosting(input)).ok, false);
assert.equal((await deletePosting(created.id)).ok, false);
authenticated = true;
assert.equal((await deletePosting(created.id)).ok, true);
assert.equal(tables.postings.some((row) => row.id === created.id), false);
assert.deepEqual(tables.postings.find((row) => row.id === "aecid"), originalAecid);
console.log("PASS: creación, adjuntos, imágenes, edición, eliminación, autorización y caché; AECID sin cambios.");
