export interface PageDocument {
  file_name: string;
  file_url: string;
  mime_type?: string;
  preview_url?: string;
}

const marker = /\n?<!-- page-documents:([\s\S]*?) -->[\s\S]*?<!-- \/page-documents -->/;
const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const safeUrl = (value: string) => /^(https?:\/\/|\/(?!\/))/.test(value) ? value : "#";

export function splitPageDocuments(content: string): { content: string; documents: PageDocument[] } {
  const match = content.match(marker);
  if (!match) return { content, documents: [] };
  try {
    const documents = JSON.parse(decodeURIComponent(match[1])) as PageDocument[];
    if (!Array.isArray(documents) || documents.some((d) => typeof d.file_name !== "string" || typeof d.file_url !== "string")) {
      return { content, documents: [] };
    }
    return { content: content.replace(marker, ""), documents };
  } catch {
    return { content, documents: [] };
  }
}

export function joinPageDocuments(content: string, documents: PageDocument[]): string {
  if (!documents.length) return content;
  const cards = documents.map((d) => {
    const url = escape(safeUrl(d.file_url));
    const title = escape(d.file_name);
    const preview = d.preview_url
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer"><img class="sp-pdf-cover" src="${escape(safeUrl(d.preview_url))}" alt="Primera página: ${title}" loading="lazy" /></a>`
      : "";
    return `<article class="sp-pdf-card">${preview}<div class="sp-pdf-body"><h3>${title}</h3><div class="sp-actions"><a class="sp-btn sp-btn--primary" href="${url}" target="_blank" rel="noopener noreferrer">Ver PDF</a><a class="sp-btn sp-btn--outline" href="${url}" download>Descargar PDF</a></div></div></article>`;
  }).join("");
  // Los datos y su presentación viajan juntos en content; no requiere migrar la tabla.
  return `${content}\n<!-- page-documents:${encodeURIComponent(JSON.stringify(documents))} --><div class="sp-pdf-grid">${cards}</div><!-- /page-documents -->`;
}
