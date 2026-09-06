import { createPublicSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  defaultSocials,
  defaultTopbarLinks,
} from "@/lib/site-config";
import type {
  Associate,
  Banner,
  Commission,
  Consultant,
  HomeStat,
  MediaItem,
  MenuItem,
  Person,
  Post,
  PostCategory,
  PostFile,
  PostImage,
  Posting,
  PostingFile,
  SitePage,
  SocialPlatform,
  TopbarLink,
  Vision,
  VisionDocument,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Fallbacks (contenido por defecto cuando Supabase no está listo)    */
/* ------------------------------------------------------------------ */

export const FALLBACK_BANNERS: Banner[] = [
  {
    id: "fb-1",
    title: "Impulsando la posición competitiva y el desarrollo sostenible",
    subtitle:
      "Articulamos los esfuerzos de empresarios, gremios, academia y gobiernos locales para generar ventajas sostenibles, atraer inversiones y potenciar a Chiriquí, Bocas del Toro y la Comarca Ngäbe-Buglé.",
    badge: "Alianza Público-Privada para el Desarrollo • Región Occidental",
    cta_label: "Conoce Más de CECOM-RO",
    cta_href: "/nosotros/quienes-somos",
    image_url:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-2",
    title: "Potenciando la Agroindustria y el Circuito del Café",
    subtitle:
      "Posicionamos el café especial de Tierras Altas y Boquete junto con la producción agropecuaria de alto valor en los principales mercados internacionales.",
    badge: "Vocación Productiva y Turística de Chiriquí",
    cta_label: "Circuito del Café",
    cta_href: "/nuestro-trabajo/turismo",
    image_url:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=80",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fb-3",
    title: "Infraestructura Estratégica para la Región Occidental",
    subtitle:
      "Promovemos proyectos clave de conectividad logística, puerto multimodal Barú y transición energética para catalizar el crecimiento socioeconómico.",
    badge: "Visión Regional 2050 en Marcha",
    cta_label: "Ver Visión 2050",
    cta_href: "/nuestro-trabajo/vision-2050",
    image_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_TOP_LINKS: TopbarLink[] = defaultTopbarLinks.map(
  (l, i) => ({
    id: `top-${i}`,
    label: l.label,
    title: (l as { title?: string }).title ?? null,
    href: l.href,
    kind: "link",
    icon: (l as { icon?: string }).icon ?? null,
    sort_order: i,
    is_active: true,
    is_external: l.is_external,
  }),
);

export const FALLBACK_SOCIALS = defaultSocials;

export const FALLBACK_BOARD: Person[] = [
  { id: "b-1", name: "Felipe Rodriguez", position: "Presidente", photo_url: null, sort_order: 1, is_active: true },
  { id: "b-2", name: "Maria Isabel De Anguizola", position: "Vicepresidente", photo_url: null, sort_order: 2, is_active: true },
  { id: "b-3", name: "Guillermo Villarreal", position: "Segundo Vicepresidente", photo_url: null, sort_order: 3, is_active: true },
  { id: "b-4", name: "Douglas Gómez", position: "Secretario", photo_url: null, sort_order: 4, is_active: true },
  { id: "b-5", name: "Luís Ríos", position: "Tesorero", photo_url: null, sort_order: 5, is_active: true },
  { id: "b-6", name: "Ricardo Pérez", position: "Vocal", photo_url: null, sort_order: 6, is_active: true },
  { id: "b-7", name: "Nixa De Ríos", position: "Vocal", photo_url: null, sort_order: 7, is_active: true },
  { id: "b-8", name: "Giselle Socarraz", position: "Fiscal", photo_url: null, sort_order: 8, is_active: true },
  { id: "b-9", name: "Malvina Moreno de Sánchez", position: "Suplente", photo_url: null, sort_order: 9, is_active: true },
  { id: "b-10", name: "Alberto Nasta", position: "Suplente", photo_url: null, sort_order: 10, is_active: true },
];

export const FALLBACK_TEAM: Person[] = [
  { id: "t-1", name: "Mirhanna Sandoya", position: "Directora Ejecutiva", photo_url: null, sort_order: 1, is_active: true },
  { id: "t-2", name: "Orquídea Victoria", position: "Administradora de Proyectos Especiales", photo_url: null, sort_order: 2, is_active: true },
];

export const FALLBACK_VACANCIES: Posting[] = [
  {
    id: "v-1",
    type: "vacancy",
    title:
      "Contratación de Especialista en Ingeniería Eléctrica y Sistemas Fotovoltaicos",
    slug: "especialista-ingenieria-electrica-fotovoltaicos",
    description:
      "<p>El CECOM-RO, en el marco de los proyectos de cooperación con AECID, requiere contratar un especialista en ingeniería eléctrica y sistemas fotovoltaicos para el desarrollo de proyectos de electrificación rural.</p><p>El profesional será responsable del diseño, supervisión e implementación de sistemas de generación fotovoltaica en comunidades de la región.</p>",
    apply_info:
      "Enviar hoja de vida actualizada y carta de interés al correo convocatorias@cecomro.com, indicando en el asunto el nombre de la convocatoria, antes de la fecha de cierre.",
    closing_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    location: "Región Ño Kribo, Comarca Ngäbe Buglé",
    is_active: true,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "v-2",
    type: "vacancy",
    title: "Contratación de Servicio de Auditoría Intermedia Externa Financiera",
    slug: "auditoria-intermedia-externa-financiera",
    description:
      "<p>Se invita a firmas de auditoría a presentar propuestas para la realización de una auditoría intermedia externa financiera de los proyectos ejecutados por el CECOM-RO en el marco de la cooperación internacional.</p>",
    apply_info:
      "Presentar la propuesta técnica y económica en sobre cerrado en las oficinas del CECOM-RO, o por correo electrónico a compras@cecomro.com.",
    closing_date: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    location: null,
    is_active: true,
    created_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
];

export const FALLBACK_POSTING_FILES: Record<string, PostingFile[]> = {
  "v-1": [
    {
      id: "pf-1",
      posting_id: "v-1",
      file_name: "TDR-Especialista-Ingenieria-Fotovoltaicos.pdf",
      file_url: "/uploads/demo/tdr-especialista-fotovoltaicos.pdf",
      mime_type: "application/pdf",
      sort_order: 1,
    },
  ],
  "v-2": [
    {
      id: "pf-2",
      posting_id: "v-2",
      file_name: "TDR-Auditoria-Intermedia-Financiera.pdf",
      file_url: "/uploads/demo/tdr-auditoria-financiera.pdf",
      mime_type: "application/pdf",
      sort_order: 1,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Consultas                                                          */
/* ------------------------------------------------------------------ */

export async function getBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured) return FALLBACK_BANNERS;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FALLBACK_BANNERS;
    return data as Banner[];
  } catch {
    return FALLBACK_BANNERS;
  }
}

export async function getTopbarLinks(): Promise<TopbarLink[]> {
  if (!isSupabaseConfigured) return FALLBACK_TOP_LINKS;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("topbar_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FALLBACK_TOP_LINKS;
    return data as TopbarLink[];
  } catch {
    return FALLBACK_TOP_LINKS;
  }
}

export async function getSocials(): Promise<
  { platform: SocialPlatform; label: string; href: string }[]
> {
  const links = await getTopbarLinks();
  const socials = links
    .filter((l) => l.kind === "social" && l.href)
    .map((l) => ({
      platform: (l.icon as SocialPlatform) ?? "facebook",
      label: l.label,
      href: l.href,
    }));
  return socials.length ? socials : FALLBACK_SOCIALS;
}

export async function getBoardMembers(): Promise<Person[]> {
  if (!isSupabaseConfigured) return FALLBACK_BOARD;
  return listPersons("board_members");
}

export async function getExecutiveTeam(): Promise<Person[]> {
  if (!isSupabaseConfigured) return FALLBACK_TEAM;
  return listPersons("executive_team");
}

async function listPersons(table: "board_members" | "executive_team") {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Person[];
  } catch {
    return [];
  }
}

export async function getCommissions(): Promise<Commission[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Commission[];
  } catch {
    return [];
  }
}

export async function getPostings(
  type: Posting["type"],
): Promise<Posting[]> {
  if (!isSupabaseConfigured) return type === "vacancy" ? FALLBACK_VACANCIES : [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("postings")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Posting[];
  } catch {
    return [];
  }
}

export async function getPostingBySlug(
  type: Posting["type"],
  slug: string,
): Promise<Posting | null> {
  if (!isSupabaseConfigured) {
    return (
      FALLBACK_VACANCIES.find((p) => p.type === type && p.slug === slug) ?? null
    );
  }
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("postings")
      .select("*")
      .eq("type", type)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as Posting;
  } catch {
    return null;
  }
}

export async function getPostingFiles(postingId: string): Promise<PostingFile[]> {
  if (!isSupabaseConfigured) return FALLBACK_POSTING_FILES[postingId] ?? [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("posting_files")
      .select("*")
      .eq("posting_id", postingId)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as PostingFile[];
  } catch {
    return [];
  }
}

export async function getMediaItems(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("media_items")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as MediaItem[];
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export async function getPostsByCategory(slug: string): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!cat) return [];
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category_id", cat.id)
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export async function getPostImages(postId: string): Promise<PostImage[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("post_images")
      .select("*")
      .eq("post_id", postId)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as PostImage[];
  } catch {
    return [];
  }
}

export async function getPostFiles(postId: string): Promise<PostFile[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("post_files")
      .select("*")
      .eq("post_id", postId)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as PostFile[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as Post;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<PostCategory[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) return [];
    return (data ?? []) as PostCategory[];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<PostCategory | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as PostCategory;
  } catch {
    return null;
  }
}

export async function getAssociates(): Promise<Associate[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("associates")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Associate[];
  } catch {
    return [];
  }
}

export async function getConsultants(): Promise<Consultant[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Consultant[];
  } catch {
    return [];
  }
}

export async function getSitePage(slug: string): Promise<SitePage | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("site_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as SitePage;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Cifras del home, configuración y visiones                          */
/* ------------------------------------------------------------------ */

export const FALLBACK_STATS: HomeStat[] = [
  { id: "hs-1", value: "2015", label: "Año de Fundación", sort_order: 1 },
  { id: "hs-2", value: "+84", label: "Asociados y Aliados", sort_order: 2 },
  { id: "hs-3", value: "3", label: "Socios Fundadores", sort_order: 3 },
  { id: "hs-4", value: "2050", label: "Visión Regional", sort_order: 4 },
];

export const FALLBACK_VISIONS: Vision[] = [
  { id: "v-1", title: "Visión País 2050", slug: "vision-pais-2050", sort_order: 1 },
  { id: "v-2", title: "Visión País 2050 Resumen Ejecutivo", slug: "vision-pais-2050-resumen-ejecutivo", sort_order: 2 },
  { id: "v-3", title: "Visión Veraguas 2050", slug: "vision-veraguas-2050", sort_order: 3 },
  { id: "v-4", title: "Visión Comarca 2050", slug: "vision-comarca-2050", sort_order: 4 },
  { id: "v-5", title: "Visión Chiriquí 2050", slug: "vision-chiriqui-2050", sort_order: 5 },
  { id: "v-6", title: "Visión Bocas del Toro 2050", slug: "vision-bocas-del-toro-2050", sort_order: 6 },
  { id: "v-7", title: "Visión Coclé 2050", slug: "vision-cocle-2050", sort_order: 7 },
  { id: "v-8", title: "Visión Colón 2050", slug: "vision-colon-2050", sort_order: 8 },
  { id: "v-9", title: "Visión Azuero 2050", slug: "vision-azuero-2050", sort_order: 9 },
  { id: "v-10", title: "Visión Región Oriental 2050", slug: "vision-region-oriental-2050", sort_order: 10 },
];

export async function getHomeStats(): Promise<HomeStat[]> {
  if (!isSupabaseConfigured) return FALLBACK_STATS;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("home_stats")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FALLBACK_STATS;
    return data as HomeStat[];
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
}

export async function getVisions(): Promise<Vision[]> {
  if (!isSupabaseConfigured) return FALLBACK_VISIONS;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("visions")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FALLBACK_VISIONS;
    return data as Vision[];
  } catch {
    return FALLBACK_VISIONS;
  }
}

export async function getVisionBySlug(slug: string): Promise<Vision | null> {
  if (!isSupabaseConfigured) {
    return FALLBACK_VISIONS.find((v) => v.slug === slug) ?? null;
  }
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("visions")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      return FALLBACK_VISIONS.find((v) => v.slug === slug) ?? null;
    }
    return data as Vision;
  } catch {
    return FALLBACK_VISIONS.find((v) => v.slug === slug) ?? null;
  }
}

function fallbackVisionDocs(visionId: string): VisionDocument[] {
  return [
    { id: `${visionId}-1`, vision_id: visionId, label: "Síntesis Diagnóstica Preliminar", file_url: "/uploads/demo/sintesis-diagnostica.pdf", sort_order: 1 },
    { id: `${visionId}-2`, vision_id: visionId, label: "Visión", file_url: "/uploads/demo/sintesis-diagnostica.pdf", sort_order: 2 },
    { id: `${visionId}-3`, vision_id: visionId, label: "Ver Versión Actualizada", file_url: "/uploads/demo/sintesis-diagnostica.pdf", sort_order: 3 },
  ];
}

export async function getVisionDocuments(
  visionId: string,
): Promise<VisionDocument[]> {
  if (!isSupabaseConfigured) return fallbackVisionDocs(visionId);
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("vision_documents")
      .select("*")
      .eq("vision_id", visionId)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallbackVisionDocs(visionId);
    return data as VisionDocument[];
  } catch {
    return fallbackVisionDocs(visionId);
  }
}

/* ------------------------------------------------------------------ */
/*  Menú (bottom header) y ajustes del header                          */
/* ------------------------------------------------------------------ */

export const FALLBACK_MENU: MenuItem[] = [
  { key: "inicio", label: "Inicio", href: "/", sort_order: 1 },
  { key: "nosotros", label: "Nosotros", href: "/nosotros/quienes-somos", sort_order: 2 },
  { key: "trabajo", label: "Nuestro Trabajo", href: "/nuestro-trabajo", sort_order: 3 },
  { key: "red", label: "Red de Centros Regionales", href: "/red-de-centros", sort_order: 4 },
  { key: "recursos", label: "Recursos de Información", href: "/recursos-de-informacion", sort_order: 5 },
  { key: "noticias", label: "Noticias", href: "/noticias", sort_order: 6 },
];

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured) return FALLBACK_MENU;
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FALLBACK_MENU;
    return data as MenuItem[];
  } catch {
    return FALLBACK_MENU;
  }
}

export interface HeaderSettings {
  logo: string;
  itseUrl: string;
  circuitoUrl: string;
}

export async function getHeaderSettings(): Promise<HeaderSettings> {
  const [logo, itseUrl, circuitoUrl] = await Promise.all([
    getSiteSetting("header_logo"),
    getSiteSetting("itse_url"),
    getSiteSetting("circuito_url"),
  ]);
  return {
    logo: logo || "/logo-cecomro.png",
    itseUrl: itseUrl || "https://www.itse.ac.pa",
    circuitoUrl: circuitoUrl || "https://circuitodelcafe.com/",
  };
}
