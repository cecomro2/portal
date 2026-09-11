/** Textos institucionales estáticos (también editables desde admin vía site_pages). */

export const QUIENES_SOMOS_FULL = `La Fundación Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO) es una Fundación de Interés Privado sin fines de lucro fundada en el año 2015, que tiene como misión impulsar la posición competitiva de la Región Occidental del país, acercando a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles y promoviendo la atracción de inversiones, el emprendimiento, las infraestructuras necesarias y la inclusión social y cultural, articulando los esfuerzos públicos y privados, y contribuyendo a su efectividad.

Surge gracias al impulso de la Asociación Panameña de Ejecutivos de Empresas (APEDE), la Cámara de Comercio, Industrias y Agricultura de Chiriquí (CAMCHI) y la Fundación Pro-Chiriquí, formada por un grupo de empresarios comprometidos con el desarrollo de la región; de iniciativas y participación de los agentes implicados en el desarrollo económico y social de la región y, en consecuencia, promueve la incorporación de empresarios, gremios, instituciones académicas y técnicas, gobiernos locales y dependencias públicas en el desarrollo, impulso y ejecución de programas, proyectos, actividades que estimulen la competitividad de la región occidental, al igual de redes de participación ciudadana para el desarrollo, implementación y seguimiento de políticas públicas alineadas con el cumplimiento de los objetivos de desarrollo sostenible de nuestra región y el país.

Actualmente cuenta con 84 asociados por medio de convenios marco de colaboración firmados y refrendados en el caso de las instituciones gubernamentales, así como con la colaboración de diversos aliados del sector público y privado, agencias de cooperación internacional e instituciones de financiación multilateral.`;

export const ABOUT_SHORT = {
  kicker: "CECOM RO",
  title: "Centro de Competitividad de la Región Occidental de Panamá",
  paragraphs: [
    "El Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO) es una Fundación privada sin ánimo de lucro que nace gracias al impulso de APEDE, la Cámara de Comercio, Industrias y Agricultura de Chiriquí y la Fundación Pro-Chiriquí, formada por un grupo de empresarios comprometidos con el desarrollo de la región, que son sus socios fundadores.",
    "La creación del centro cuenta con el apoyo especial de CAF, Banco de Desarrollo de América Latina, fiel a su compromiso de impulsar y promover el desarrollo socio-económico de Chiriquí y la región occidental del país. Cuenta también con el apoyo destacado del Instituto Interamericano de Cooperación para la Agricultura, así como con la colaboración de diversas agencias de cooperación internacional e instituciones de financiación multilateral.",
  ],
};

export const WORK_AREAS: {
  slug: string;
  title: string;
  description: string;
}[] = [
  {
    slug: "vision-2050",
    title: "Visión 2050",
    description:
      "Agenda de largo plazo que orienta el desarrollo competitivo, social y cultural de la región occidental de Panamá.",
  },
  {
    slug: "educacion",
    title: "Educación",
    description:
      "Iniciativas que fortalecen el talento humano y vinculan la academia con las necesidades del sector productivo.",
  },
  {
    slug: "agro",
    title: "Agro",
    description:
      "Impulso a la competitividad del sector agropecuario y agroindustrial de la región.",
  },
  {
    slug: "turismo",
    title: "Turismo",
    description:
      "Promoción de destinos y desarrollo de una oferta turística competitiva y sostenible.",
  },
  {
    slug: "gestion-territorial",
    title: "Gestión Territorial",
    description:
      "Ordenamiento y planificación del territorio para un desarrollo equilibrado.",
  },
  {
    slug: "gobernabilidad",
    title: "Gobernabilidad",
    description:
      "Fortalecimiento institucional y articulación público-privada para políticas públicas efectivas.",
  },
  {
    slug: "estudios",
    title: "Estudios",
    description:
      "Investigación y análisis aplicado para la toma de decisiones basada en evidencia.",
  },
];

/** Páginas editables desde el panel de administración. */
export const EDITABLE_PAGES: { slug: string; title: string; path: string }[] = [
  { slug: "plan-estrategico", title: "Plan Estratégico", path: "/nosotros/plan-estrategico" },
  { slug: "vision-2050", title: "Visión 2050", path: "/nuestro-trabajo/vision-2050" },
  { slug: "educacion", title: "Educación", path: "/nuestro-trabajo/educacion" },
  { slug: "agro", title: "Agro", path: "/nuestro-trabajo/agro" },
  { slug: "turismo", title: "Turismo", path: "/nuestro-trabajo/turismo" },
  { slug: "gestion-territorial", title: "Gestión Territorial", path: "/nuestro-trabajo/gestion-territorial" },
  { slug: "gobernabilidad", title: "Gobernabilidad", path: "/nuestro-trabajo/gobernabilidad" },
  { slug: "estudios", title: "Estudios", path: "/nuestro-trabajo/estudios" },
];

export const PLACEHOLDER_PAGE = {
  vision2050: `La Visión 2050 es la agenda de desarrollo de largo plazo de la Región Occidental de Panamá, construida de forma participativa con los actores públicos y privados. Define las prioridades estratégicas en materia de competitividad, infraestructura, educación, inclusión social y sostenibilidad, alineadas con los Objetivos de Desarrollo Sostenible.`,
};
