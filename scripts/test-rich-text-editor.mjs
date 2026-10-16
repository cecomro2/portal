// Prueba aislada: no inicia sesión ni guarda noticias reales.
// PLAYWRIGHT_MODULE puede apuntar al Playwright del runtime de pruebas.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const helper = {};
runInNewContext(ts.transpileModule(await readFile("src/lib/editor-links.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: helper, URL });
for (const url of ["javascript:alert(1)", "data:text/html,test", "//evil.com", "/\\evil.com", "https://user:pass@example.com", "https://example.com\n"]) {
  // El espacio exterior se recorta; los saltos internos no se aceptan.
  if (!url.endsWith("\n")) assert.equal(helper.normalizeEditorUrl(url), null);
}
for (const url of ["https://example.com/", "mailto:info@example.com", "tel:+50712345678", "/noticias", "#seccion"]) assert.ok(helper.normalizeEditorUrl(url));
assert.equal(helper.normalizeEditorUrl("www.example.com"), "https://www.example.com/");

const webpack = require("next/dist/compiled/webpack/webpack");
const temp = await mkdtemp(path.join(tmpdir(), "cecomro-editor-test-"));
await new Promise((resolve, reject) => webpack.webpack({
  mode: "development", devtool: false, context: process.cwd(),
  entry: path.resolve("scripts/editor-test-fixture.tsx"), output: { path: temp, filename: "bundle.js" },
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "@": path.resolve("src") } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.resolve("scripts/editor-test-loader.cjs") }] },
}, (error, stats) => {
  if (error) reject(error); else if (stats.hasErrors()) reject(new Error(stats.toString({ all: false, errors: true }))); else resolve();
}));
const bundle = await readFile(path.join(temp, "bundle.js"));
const server = createServer((req, res) => {
  if (req.url === "/bundle.js") { res.setHeader("Content-Type", "text/javascript"); res.end(bundle); }
  else { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end('<!doctype html><html><head><title>Prueba aislada del editor</title></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>'); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
let browser;
try {
  try { browser = await chromium.launch({ headless: true }); }
  catch { browser = await chromium.launch({ headless: true, channel: "msedge" }); }
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const editor = page.getByRole("textbox", { name: "Contenido enriquecido" });
  await editor.locator("strong").waitFor();
  assert.ok((await editor.innerHTML()).includes("Enlace existente"));
  // Selecciona una frase formateada y crea el enlace sin perder la selección.
  await editor.locator("strong").evaluate((node) => {
    const range = document.createRange(); range.selectNodeContents(node);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  });
  await page.getByRole("button", { name: "Enlace", exact: true }).click();
  await page.getByRole("textbox", { name: "URL del enlace" }).fill("https://example.com/nuevo");
  await page.getByRole("button", { name: "Aplicar enlace" }).click();
  let anchor = editor.locator('a[href="https://example.com/nuevo"]');
  assert.equal(await anchor.textContent(), "con formato");
  assert.equal(await anchor.getAttribute("target"), "_blank");
  assert.ok((await anchor.getAttribute("rel")).includes("noopener"));
  assert.ok((await anchor.getAttribute("rel")).includes("noreferrer"));
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  assert.equal(await editor.locator('a[href="https://example.com/nuevo"]').count(), 0);
  await page.getByRole("button", { name: "Rehacer", exact: true }).click();
  assert.equal(await anchor.getAttribute("href"), "https://example.com/nuevo");
  assert.equal(await anchor.getAttribute("target"), "_blank");
  // Edita un enlace existente para abrirlo en la misma pestaña.
  await anchor.evaluate((node) => { const r = document.createRange(); r.selectNodeContents(node); r.collapse(true); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.getByRole("button", { name: "Enlace", exact: true }).click();
  await page.getByLabel("Abrir en una pestaña nueva").uncheck();
  await page.getByRole("button", { name: "Aplicar enlace" }).click();
  assert.equal(await anchor.getAttribute("target"), null);
  // Rechaza protocolos inseguros sin alterar el contenido guardado.
  await anchor.evaluate((node) => { const r = document.createRange(); r.selectNodeContents(node); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.getByRole("button", { name: "Enlace", exact: true }).click();
  await page.getByRole("textbox", { name: "URL del enlace" }).fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Aplicar enlace" }).click();
  assert.ok((await page.getByRole("alert").textContent()).includes("válidos"));
  await page.getByRole("button", { name: "Quitar enlace", exact: true }).click();
  assert.equal(await editor.locator('a[href="https://example.com/nuevo"]').count(), 0);
  assert.ok((await editor.textContent()).includes("con formato"));
  assert.equal(await editor.locator('a[href="https://example.com/original"]').count(), 1);
  // Cita, salida de cita y formato existentes.
  await editor.locator("p").first().evaluate((node) => { const r = document.createRange(); r.selectNodeContents(node); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.getByRole("button", { name: "Cita destacada", exact: true }).click();
  assert.ok(await editor.locator("blockquote").count());
  await page.getByRole("button", { name: "Párrafo normal / salir de cita", exact: true }).click();
  assert.equal(await editor.locator("blockquote").count(), 0);
  assert.ok((await page.locator("#saved-html").textContent()).includes("Enlace existente"));
  // Cancelar no altera HTML ni dispara el formulario de publicación.
  const beforeCancel = await page.locator("#saved-html").textContent();
  await page.getByRole("button", { name: "Enlace", exact: true }).click();
  await page.getByRole("textbox", { name: "URL del enlace" }).fill("https://example.com/cancelado");
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  assert.equal(await page.locator("#saved-html").textContent(), beforeCancel);
  // Insertar sin texto seleccionado funciona; Enter aplica solo el enlace.
  await editor.evaluate((node) => { const r = document.createRange(); r.selectNodeContents(node); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.getByRole("button", { name: "Enlace", exact: true }).click();
  await page.getByRole("textbox", { name: "URL del enlace" }).fill("https://example.com/sin-seleccion");
  await page.getByRole("textbox", { name: "URL del enlace" }).press("Enter");
  assert.equal(await editor.locator('a[href="https://example.com/sin-seleccion"]').count(), 1);
  assert.equal(await page.locator("#form-submissions").textContent(), "0");
  await page.getByRole("button", { name: "Guardar noticia de prueba" }).click();
  assert.equal(await page.locator("#form-submissions").textContent(), "1");
  console.log("PASS navegador: citas, párrafos, selección formateada, enlaces nueva/misma pestaña, edición, quitar enlace, seguridad y contenido previo preservado.");
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
