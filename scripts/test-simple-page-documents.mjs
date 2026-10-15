import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function load(file) {
  const result = {};
  runInNewContext(ts.transpileModule(await readFile(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: result, require });
  return result;
}
const { joinPageDocuments, splitPageDocuments } = await load("src/lib/simple-page-documents.ts");
const docs = [{ file_name: 'Plan Ñürüm <2026> "PDF"', file_url: "https://files.example.com/a.pdf", preview_url: "https://files.example.com/a.png" }];
const original = "<h2>Contenido existente</h2><p>Sin cambios.</p>";
const html = joinPageDocuments(original, docs);
assert.equal(splitPageDocuments(html).content, original);
assert.equal(JSON.stringify(splitPageDocuments(html).documents), JSON.stringify(docs));
assert.equal(joinPageDocuments(original, []), original);
assert.ok(html.includes("loading=\"lazy\""));
assert.ok(html.includes("&lt;2026&gt;"));
assert.ok(!joinPageDocuments("", [{ file_name: "PDF", file_url: "javascript:alert(1)" }]).includes('href="javascript:'));
const malformed = "<!-- page-documents:invalid -->contenido<!-- /page-documents -->";
assert.equal(splitPageDocuments(malformed).content, malformed);
const { withSimplePages, mainNav } = await load("src/lib/site-config.ts");
const trabajo = mainNav.find((item) => item.key === "trabajo");
for (const section of ["en-ejecucion", "ejecutados", "impulsamos"]) {
  const group = trabajo.children.find((item) => item.href === `#${section}`);
  assert.equal(group.children.filter((item) => item.href === `#${section}-innovacion-social` && item.label === "Innovación Social").length, 1);
  const injected = withSimplePages([{ title: "Proyecto de prueba", path: `/prueba-${section}`, parent_href: `#${section}-innovacion-social`, sort_order: 1 }], mainNav);
  const category = injected.find((item) => item.key === "trabajo").children.find((item) => item.href === `#${section}`).children.find((item) => item.href === `#${section}-innovacion-social`);
  assert.equal(category.children[0].href, `/prueba-${section}`);
}
const paths = ["/nuestro-trabajo/gestion-territorial-aecid", "/nuestro-trabajo/planes-estrategicos-cnb"];
const pages = paths.map((path, i) => ({ title: `CNB ${i}`, path, parent_href: "#ejecutados-gestion-territorial", sort_order: i }));
pages.push({ title: "Circuito del Café", path: "/nuestro-trabajo/turismo/circuito-del-cafe", parent_href: "#ejecutados-turismo", sort_order: 0 });
const menu = withSimplePages(pages, mainNav);
const flat = [];
function walk(items) { for (const item of items) { flat.push(item); if(item.children) walk(item.children); } }
walk(menu);
for (const page of pages) assert.equal(flat.filter((i) => i.href === page.path).length, 1);
const group = flat.find((i) => i.href === "#ejecutados-gestion-territorial");
assert.equal(group.children[0].href, paths[0]);
assert.equal(group.children[1].href, paths[1]);
const moved = withSimplePages([{ ...pages[2], parent_href: "#impulsamos-turismo" }], mainNav);
const movedFlat = [];
function collect(items) { for (const item of items) { movedFlat.push(item); if (item.children) collect(item.children); } }
collect(moved);
assert.equal(movedFlat.filter((i) => i.href === pages[2].path).length, 1);
assert.ok(movedFlat.find((i) => i.href === "#impulsamos-turismo").children.some((i) => i.href === pages[2].path));
console.log("PASS: documentos editables sin perder HTML, retirada de adjuntos, URLs seguras, portadas diferidas, menú sin duplicados y CNB consecutivas.");
