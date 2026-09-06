import {
  Briefcase,
  FileText,
  ShoppingCart,
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
      { label: "Comisiones de Trabajo", href: "/nosotros/comisiones-de-trabajo" },
      { label: "Plan Estratégico", href: "/nosotros/plan-estrategico" },
      { label: "Asociados y Aliados", href: "/nosotros/asociados-y-aliados" },
      { label: "Red de Consultores", href: "/nosotros/red-de-consultores" },
    ],
  },
  {
    key: "trabajo",
    label: "Nuestro Trabajo",
    href: "/nuestro-trabajo",
    children: [
      {
        label: "Proyectos de Cooperación",
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
      },
      {
        label: "Visión País",
        href: "/vision-pais",
        children: [],
      },
      { label: "Educación", href: "/nuestro-trabajo/educacion" },
      { label: "Agro", href: "/nuestro-trabajo/agro" },
      {
        label: "Turismo",
        href: "/nuestro-trabajo/turismo",
        children: [
          { label: "Circuito del Café", href: "/nuestro-trabajo/turismo/circuito-del-cafe" },
          { label: "Circuito Golfo de Chiriquí", href: "https://circuitogolfodechiriqui.com" },
          { label: "Boca Chica", href: "/nuestro-trabajo/turismo/boca-chica" },
        ],
      },
      { label: "Gestión Territorial", href: "/nuestro-trabajo/gestion-territorial" },
      {
        label: "Gobernabilidad",
        href: "/nuestro-trabajo/gobernabilidad",
        children: [
          {
            label: "Síntesis Diagnósticos Provinciales",
            href: "/nuestro-trabajo/gobernabilidad/sintesis-diagnosticos-provinciales",
            icon: "file-text",
          },
        ],
      },
      { label: "Estudios", href: "/nuestro-trabajo/estudios" },
    ],
  },
  {
    key: "red",
    label: "Red de Centros Regionales",
    href: "/red-de-centros",
    children: [
      { label: "CECOMCE", href: "https://www.cecomce.com/" },
      { label: "CECOMCRO", href: "https://www.instagram.com/fcecomcro/?hl=en" },
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
  { label: "Contacto", href: "/contacto", kind: "link", icon: null, is_external: false },
  { label: "ITSE Panamá", href: "https://itse.ac.pa", kind: "link", icon: null, is_external: true },
  { label: "Visiones Regionales 2050", href: "/nuestro-trabajo/vision-2050", kind: "link", icon: null, is_external: false },
];

export const CONTACT = {
  location: ["Edificio Brencan", "Calle B Norte", "David, Chiriquí"],
  hours: ["Lunes a Viernes: 8:00 am a 5:00 pm", "Sábado: 9:00 am a 12:00 md"],
  phones: ["+507 6079-1889"],
} as const;

export const MISSION =
  "Impulsar la posición competitiva de la Región Occidental del país: Acercando a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles; promoviendo la atracción de inversiones, el emprendimiento, las infraestructuras necesarias y la inclusión social y cultural; articulando los esfuerzos públicos y privados, y contribuyendo a su efectividad.";
