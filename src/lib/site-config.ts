import {
  Briefcase,
  Building2,
  Coffee,
  Compass,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Info,
  Link2,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SocialPlatform } from "@/lib/types";

export const SITE = {
  name: "CECOM-RO",
  fullName: "Centro de Competitividad de la Región Occidental de Panamá",
  url: "https://cecomro.com",
  description:
    "Impulsamos la posición competitiva de la Región Occidental de Panamá.",
} as const;

export const BRAND = {
  primary: "#2F358A",
  accent: "#C63E43",
} as const;

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  key?: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

/** Mapa de iconos del menú (clave → componente). */
export const NAV_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  "file-text": FileText,
};

/** Iconos disponibles para los enlaces del top header (clave → componente). */
export const TOPBAR_ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  globe: Globe,
  compass: Compass,
  "graduation-cap": GraduationCap,
  coffee: Coffee,
  briefcase: Briefcase,
  "file-text": FileText,
  building: Building2,
  users: Users,
  newspaper: Newspaper,
  "map-pin": MapPin,
  info: Info,
  "external-link": ExternalLink,
  link: Link2,
};

/** Lista de iconos para el selector del admin (sin exponer componentes). */
export const TOPBAR_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Sin icono" },
  { value: "mail", label: "Correo" },
  { value: "phone", label: "Teléfono" },
  { value: "globe", label: "Sitio web" },
  { value: "compass", label: "Brújula" },
  { value: "graduation-cap", label: "Educación" },
  { value: "coffee", label: "Café" },
  { value: "briefcase", label: "Trabajo" },
  { value: "file-text", label: "Documento" },
  { value: "building", label: "Institución" },
  { value: "users", label: "Personas" },
  { value: "newspaper", label: "Noticias / Prensa" },
  { value: "map-pin", label: "Ubicación" },
  { value: "info", label: "Información" },
  { value: "external-link", label: "Enlace externo" },
  { value: "link", label: "Enlace" },
];

/** Áreas base (enlaces directos). */
const area = {
  agro: { label: "Agro", href: "/nuestro-trabajo/agro" },
  educacion: { label: "Educación", href: "/nuestro-trabajo/educacion" },
  turismo: { label: "Turismo", href: "/nuestro-trabajo/turismo" },
  gestion: { label: "Gestión Territorial", href: "/nuestro-trabajo/gestion-territorial" },
  gobernabilidad: { label: "Gobernabilidad", href: "/nuestro-trabajo/gobernabilidad" },
};

const enEjecucionAreas: NavItem[] = [
  area.agro,
  area.educacion,
  area.turismo,
  area.gestion,
  area.gobernabilidad,
];

const ejecutadosAreas: NavItem[] = [
  { ...area.agro, children: [{ label: "PIASI", href: "/nuestro-trabajo/piasi" }] },
  area.educacion,
  {
    ...area.turismo,
    children: [
      { label: "Circuito del Café", href: "/nuestro-trabajo/turismo/circuito-del-cafe" },
      { label: "Circuito Golfo de Chiriquí", href: "https://circuitogolfodechiriqui.com" },
      { label: "Boca Chica", href: "/nuestro-trabajo/turismo/boca-chica" },
    ],
  },
  { ...area.gestion, children: [{ label: "Gestión Territorial AECID", href: "/nuestro-trabajo/gestion-territorial-aecid" }] },
  area.gobernabilidad,
];

const impulsamosAreas: NavItem[] = [
  {
    ...area.agro,
    children: [
      { label: "Política Agroalimentaria de Estado", href: "https://www.caf.com/es/actualidad/noticias/panama-sanciona-ley-de-politica-agroalimentaria-de-estado-que-impulsara-su-competitividad-con-el-apoyo-de-caf" },
      { label: "CBI", href: "/noticias/categoria/agro" },
    ],
  },
  area.educacion,
  area.turismo,
  area.gestion,
  area.gobernabilidad,
];

/** Bloque AECID (va aparte dentro de "Proyectos en Ejecución"). */
const aecidSubmenu: NavItem = {
  label: "Proyectos de Cooperación AECID",
  href: "/nuestro-trabajo/proyectos-de-cooperacion",
  children: [
    {
      label: "Vacantes AECID",
      href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid",
      icon: "briefcase",
    },
    {
      label: "Portal de Compras AECID",
      href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid",
      icon: "shopping-cart",
    },
  ],
};

/** Menú principal (bottom menu). */
export const mainNav: NavItem[] = [
  { key: "inicio", label: "Inicio", href: "/" },
  {
    key: "nosotros",
    label: "Nosotros",
    href: "/nosotros/quienes-somos",
    children: [
      { label: "Quiénes Somos", href: "/nosotros/quienes-somos" },
      { label: "Misión", href: "/nosotros/mision" },
      { label: "Junta Directiva", href: "/nosotros/junta-directiva" },
      { label: "Equipo Ejecutivo", href: "/nosotros/equipo-ejecutivo" },
      { label: "Plan Estratégico", href: "/nosotros/plan-estrategico" },
      { label: "Asociados y Aliados", href: "/nosotros/asociados-y-aliados" },
    ],
  },
  {
    key: "trabajo",
    label: "Nuestro Trabajo",
    href: "/nuestro-trabajo",
    children: [
      {
        label: "Proyectos en Ejecución",
        href: "/nuestro-trabajo/proyectos-de-cooperacion",
        children: [...enEjecucionAreas, aecidSubmenu],
      },
      {
        label: "Proyectos Ejecutados",
        href: "/nuestro-trabajo",
        children: ejecutadosAreas,
      },
      {
        label: "Proyectos que Impulsamos",
        href: "/nuestro-trabajo",
        children: impulsamosAreas,
      },
      {
        label: "Visión País",
        href: "/vision-pais",
        children: [],
      },
    ],
  },
  {
    key: "recursos",
    label: "Recursos de Información",
    href: "/recursos-de-informacion",
    children: [
      { label: "Boletín Informativo", href: "/noticias/categoria/boletin-informativo" },
    ],
  },
  { key: "noticias", label: "Prensa", href: "/noticias/categoria/prensa" },
];

/** Inyecta las visiones (dinámicas) dentro del submenú "Visión País". */
export function withVisions(
  visions: { title: string; slug: string }[],
  base: NavItem[] = mainNav,
): NavItem[] {
  const visionChildren = visions.map((v) => ({
    label: v.title,
    href: `/vision-pais/${v.slug}`,
    icon: "file-text",
  }));

  const mapItem = (item: NavItem): NavItem => {
    if (item.href === "/vision-pais") {
      return { ...item, children: visionChildren };
    }
    if (item.children) {
      return { ...item, children: item.children.map(mapItem) };
    }
    return item;
  };

  return base.map(mapItem);
}

/** Sobrescribe los items de primer nivel del menú (bottom header) editables. */
export function withMenu(
  menuItems: { key: string; label: string; href: string }[],
  base: NavItem[] = mainNav,
): NavItem[] {
  const map = new Map(menuItems.map((m) => [m.key, m]));
  return base.map((item) => {
    if (item.key && map.has(item.key)) {
      const m = map.get(item.key)!;
      return { ...item, label: m.label, href: m.href };
    }
    return item;
  });
}

export interface SearchablePage {
  label: string;
  href: string;
  description?: string;
}

/** Aplana el menú en una lista de páginas buscables (solo enlaces internos). */
export function flattenNav(nav: NavItem[] = mainNav): SearchablePage[] {
  const out: SearchablePage[] = [];
  const walk = (items: NavItem[]) => {
    for (const item of items) {
      if (item.href.startsWith("/")) {
        out.push({ label: item.label, href: item.href });
      }
      if (item.children) walk(item.children);
    }
  };
  walk(nav);
  return out;
}

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export const defaultSocials: SocialLink[] = [
  { platform: "facebook", label: "Facebook", href: "https://facebook.com/cecomro" },
  { platform: "twitter", label: "Twitter", href: "https://twitter.com/cecomro" },
  { platform: "youtube", label: "YouTube", href: "https://youtube.com/@cecomro" },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com/cecomro" },
];

/** Enlaces por defecto del top header (editables en admin). */
export const defaultTopbarLinks = [
  { label: "Contacto", href: "/contacto", kind: "link", icon: "mail", title: "Contacto", is_external: false },
  { label: "ITSE Panamá", href: "https://itse.ac.pa", kind: "link", icon: "graduation-cap", title: "ITSE Panamá", is_external: true },
  { label: "Visiones Regionales 2050", href: "/nuestro-trabajo/vision-2050", kind: "link", icon: "compass", title: "Visiones Regionales 2050", is_external: false },
];

export const CONTACT = {
  location: [
    "Plaza Felipe Rodríguez",
    "Calle Felipe Rodríguez",
    "Piso #2",
    "David, Chiriquí",
  ],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Plaza%20Felipe%20Rodr%C3%ADguez%20David%20Chiriqu%C3%AD%20Panam%C3%A1",
  hours: ["Lunes a Viernes: 8:00 am a 5:00 pm", "Sábado: 9:00 am a 12:00 md"],
  phones: ["+507 6728-9192"],
} as const;

export const MISSION =
  "Impulsar la posición competitiva de la Región Occidental del país: Acercando a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles; promoviendo la atracción de inversiones, el emprendimiento, las infraestructuras necesarias y la inclusión social y cultural; articulando los esfuerzos públicos y privados, y contribuyendo a su efectividad.";
