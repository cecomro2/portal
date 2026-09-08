import { writeFileSync } from "node:fs";

const BASE = "https://www.cecomro.com";
const CAT = `${BASE}/category/boletin-informativo/`;

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function unescapeHtml(s) {
  return s
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 1) Recoger listados de las páginas de categoría
const posts = [];
for (let page = 1; page <= 4; page++) {
  const url = page === 1 ? CAT : `${CAT}page/${page}/`;
  let html;
  try {
    html = await fetchText(url);
  } catch (e) {
    console.log(`Fin de paginación en página ${page}: ${e.message}`);
    break;
  }
  // Cada <article class="post post-grid ..."> ... </article>
  const articleRe = /<article class="post post-grid[^"]*"[\s\S]*?<\/article>/g;
  let m;
  let found = 0;
  while ((m = articleRe.exec(html)) !== null) {
    const block = m[0];
    const titleM = /<h4 class="entry-title"><a href="([^"]+)">([\s\S]*?)<\/a><\/h4>/.exec(block);
    const imgM = /data-src="([^"]+)"/.exec(block) || /<img[^>]+src="([^"]+)"/.exec(block);
    const dateM = /<span class="meta-date">[\s\S]*?([A-Za-zÀ-ÿ0-9, ]+?)<\/span>/.exec(block);
    if (!titleM) continue;
    posts.push({
      url: titleM[1],
      title: unescapeHtml(titleM[2]),
      image: imgM ? imgM[1] : null,
      dateRaw: dateM ? unescapeHtml(dateM[1]) : null,
    });
    found++;
  }
  console.log(`Página ${page}: ${found} artículos`);
  if (found === 0) break;
}

console.log(`\nTotal posts: ${posts.length}`);

// 2) Para cada post, obtener og:image, fecha y PDF
const result = [];
for (const p of posts) {
  let detail;
  try {
    detail = await fetchText(p.url);
  } catch (e) {
    console.log(`ERROR fetch ${p.url}: ${e.message}`);
    result.push({ ...p, ogImage: null, date: null, pdf: null });
    continue;
  }
  const ogM = /<meta property="og:image" content="([^"]+)"/.exec(detail);
  const dateM = /"datePublished":"([^"]+)"/.exec(detail);
  // PDF: buscar cualquier .pdf dentro de wp-content/uploads (los href pueden llevar espacios: href = "..."; a veces sin www)
  const pdfM = /(https:\/\/(?:www\.)?cecomro\.com\/wp-content\/uploads\/[^"'\s<>]+\.pdf)/i.exec(detail);
  result.push({
    ...p,
    ogImage: ogM ? ogM[1] : null,
    date: dateM ? dateM[1] : null,
    pdf: pdfM ? pdfM[1] : null,
  });
  console.log(`${result.length}. ${p.title} | pdf=${pdfM ? "SÍ" : "NO"}`);
}

writeFileSync(new URL("./boletines.json", import.meta.url), JSON.stringify(result, null, 2));
console.log("\nGuardado en scripts/boletines.json");
