export function getShareLinks(url: string, title: string) {
  const query = (values: Record<string, string>) => new URLSearchParams(values).toString();
  return [
    { name: "WhatsApp", href: `https://wa.me/?${query({ text: `${title}\n${url}` })}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?${query({ u: url })}` },
    { name: "X", href: `https://twitter.com/intent/tweet?${query({ text: title, url })}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?${query({ url })}` },
    { name: "Telegram", href: `https://t.me/share/url?${query({ url, text: title })}` },
    { name: "Correo electrónico", href: `mailto:?${query({ subject: title, body: `${title}\n${url}` }).replace(/\+/g, "%20")}` },
  ];
}
