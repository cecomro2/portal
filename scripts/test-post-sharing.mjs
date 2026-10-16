// Pruebas aisladas: no publica mensajes ni navega a redes sociales.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import path from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const helpers = {};
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
runInNewContext(compile(await readFile("src/lib/share-links.ts", "utf8")), { exports: helpers, URLSearchParams });
const url = "https://www.cecomro.com/prueba-blog?a=1&b=2";
const title = 'Innovación & desarrollo: Panamá "2026"';
const links = helpers.getShareLinks(url, title);
assert.equal(links.length, 6);
const byName = (name) => new URL(links.find((link) => link.name === name).href);
assert.equal(byName("Facebook").searchParams.get("u"), url);
assert.equal(byName("WhatsApp").searchParams.get("text"), `${title}\n${url}`);
assert.equal(byName("X").searchParams.get("text"), title);
assert.equal(byName("X").searchParams.get("url"), url);
assert.equal(byName("LinkedIn").searchParams.get("url"), url);
assert.equal(byName("Telegram").searchParams.get("text"), title);
assert.equal(byName("Correo electrónico").searchParams.get("subject"), title);

// Renderiza el PostCard real, sin router ni base de datos.
const component = {};
runInNewContext(compile(await readFile("src/components/site/post-card.tsx", "utf8")), { exports: component, require: (name) => name === "@/lib/utils" ? { formatDate: () => "16 de octubre de 2026" } : require(name) });
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sample = { id: "test", title: "Noticia de prueba", slug: "prueba-blog", cover_image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3C/svg%3E", excerpt: "Resumen", published_at: "2026-10-16" };
const card = renderToStaticMarkup(React.createElement(component.PostCard, { post: sample }));
assert.ok(card.includes('aria-label="Ver publicación: Noticia de prueba"'));
assert.ok(card.includes("group-hover:scale-105"));
const fallback = renderToStaticMarkup(React.createElement(component.PostCard, { post: { ...sample, cover_image_url: null } }));
assert.ok(fallback.includes('aria-label="Ver publicación: Noticia de prueba"'));

const webpack = require("next/dist/compiled/webpack/webpack");
const temp = await mkdtemp(path.join(tmpdir(), "cecomro-share-test-"));
await new Promise((resolve, reject) => webpack.webpack({ mode: "development", devtool: false, context: process.cwd(), entry: path.resolve("scripts/share-test-fixture.tsx"), output: { path: temp, filename: "bundle.js" }, resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "@": path.resolve("src") } }, module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.resolve("scripts/editor-test-loader.cjs") }] } }, (error, stats) => {
  if(error) reject(error); else if(stats.hasErrors()) reject(new Error(stats.toString({all: false, errors: true}))); else resolve();
}));
const bundle = await readFile(path.join(temp,"bundle.js"));
const server = createServer((req,res) => {
  if(req.url === "/bundle.js") { res.setHeader("Content-Type", "text/javascript"); res.end(bundle); }
  else if(req.url === "/prueba-blog") { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end("<h1>Publicación de prueba</h1>"); }
  else { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>[role="group"]{position:fixed;box-sizing:border-box;width:256px;max-width:calc(100vw - 2rem);overflow-y:auto}</style></head><body><div id="root"></div><section>${card}</section><script src="/bundle.js"></script></body></html>`); }
});
await new Promise((resolve) => server.listen(0,"127.0.0.1",resolve));
let browser;
try {
  const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  try { browser = await chromium.launch({headless:true}); } catch { browser = await chromium.launch({headless:true,channel:"msedge"}); }
  const page = await browser.newPage();
  await page.addInitScript(() => { Object.defineProperty(navigator,"clipboard",{ configurable: true, value: { writeText: async (value) => { document.documentElement.dataset.copied = value; } } }); });
  const external = [];
  page.on("request",(request) => { if(request.url().startsWith("http") && !request.url().startsWith("http://127.0.0.1:")) external.push(request.url()); });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const trigger = page.getByRole("button",{name:"Compartir",exact:true});
  await trigger.click();
  const panel = page.getByRole("group",{name:"Opciones para compartir"});
  assert.equal(await panel.isVisible(),true);
  for(const name of ["WhatsApp","Facebook","X","LinkedIn","Telegram"]) {
    const link = panel.getByRole("link",{name,exact:true});
    assert.equal(await link.getAttribute("target"),"_blank");
    assert.ok((await link.getAttribute("rel")).includes("noopener"));
  }
  await panel.getByRole("button",{name:"Copiar enlace",exact:true}).click();
  assert.equal(await page.locator("html").getAttribute("data-copied"),"https://www.cecomro.com/prueba-blog");
  assert.equal(await panel.getByRole("status").textContent(),"Enlace copiado.");
  await page.keyboard.press("Escape");
  assert.equal(await trigger.getAttribute("aria-expanded"),"false");
  assert.equal(await trigger.evaluate((node)=>node===document.activeElement),true);
  await trigger.click();
  await page.getByRole("button",{name:"Fuera del panel"}).click();
  assert.equal(await panel.count(),0);
  // Un fallo del portapapeles conserva la URL seleccionable como alternativa.
  await page.evaluate(()=>{Object.defineProperty(navigator,"clipboard",{value:{writeText:async()=>{throw new Error("denegado");}}});});
  await trigger.click();
  await panel.getByRole("button",{name:"Copiar enlace",exact:true}).click();
  assert.ok((await panel.getByRole("status").textContent()).includes("Selecciona y copia"));
  assert.equal(await panel.getByRole("textbox",{name:"Enlace de la publicación"}).inputValue(),"https://www.cecomro.com/prueba-blog");
  await page.keyboard.press("Escape");
  await page.setViewportSize({width:320,height:640});
  await trigger.click();
  const mobileBounds = await panel.boundingBox();
  assert.ok(mobileBounds.x >= 0 && mobileBounds.x + mobileBounds.width <= 320, "El panel no debe salirse en móvil");
  await page.keyboard.press("Escape");
  const imageLink = page.getByRole("link",{name:"Ver publicación: Noticia de prueba",exact:true});
  await imageLink.hover();
  assert.equal(await imageLink.getAttribute("href"),"/prueba-blog");
  await imageLink.click();
  await page.waitForURL("**/prueba-blog");
  assert.equal(await page.getByRole("heading").textContent(),"Publicación de prueba");
  assert.equal(external.length,0,"No deben cargarse widgets ni contactar redes antes de compartir");
  console.log("PASS navegador: redes, URL/título codificados, copiar y alternativa, Escape, clic exterior, enlaces seguros y portada clicable; sin solicitudes a redes.");
} finally { if(browser) await browser.close(); await new Promise((resolve)=>server.close(resolve)); }
