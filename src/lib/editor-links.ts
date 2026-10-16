/** Protocolos permitidos en enlaces creados desde el editor. */
export function normalizeEditorUrl(input: string): string | null {
  let value = input.trim();
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value) || value.startsWith("//")) return null;
  if (value.startsWith("/") || value.startsWith("#")) return value;
  if (/^www\./i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

export function setEditorLinkAttributes(link: HTMLAnchorElement, url: string, newTab: boolean) {
  link.setAttribute("href", url);
  const rel = new Set((link.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean));
  if (newTab) {
    link.setAttribute("target", "_blank");
    rel.add("noopener"); rel.add("noreferrer");
  } else {
    link.removeAttribute("target");
    rel.delete("noopener"); rel.delete("noreferrer");
  }
  if (rel.size) link.setAttribute("rel", [...rel].join(" "));
  else link.removeAttribute("rel");
}
