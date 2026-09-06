import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  Coffee,
  Compass,
  GraduationCap,
  Layers,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { getBanners, getHomeStats, getPosts, getSiteSetting } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Hero } from "@/components/site/hero";
import { Reveal } from "@/components/site/reveal";

const axes: {
  icon: LucideIcon;
  color: string;
  title: string;
  desc: string;
  href: string;
  linkLabel: string;
  subs?: { label: string; href: string }[];
}[] = [
  {
    icon: Briefcase,
    color: "bg-accent-50 text-accent-500",
    title: "Proyectos de Cooperación",
    desc: "Gestión de fondos con organismos internacionales, vacantes de empleo y licitaciones del Portal de Compras AECID.",
    href: "/nuestro-trabajo/proyectos-de-cooperacion",
    linkLabel: "Ver Proyectos",
    subs: [
      { label: "Vacantes AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion/vacantes-aecid" },
      { label: "Portal de Compras AECID", href: "/nuestro-trabajo/proyectos-de-cooperacion/portal-de-compras-aecid" },
    ],
  },
  {
    icon: Compass,
    color: "bg-primary-50 text-primary-600",
    title: "Visión País",
    desc: "Hoja de ruta estratégica a largo plazo con las visiones regionales 2050 de Panamá.",
    href: "/vision-pais",
    linkLabel: "Ver Visiones",
  },
  {
    icon: Sprout,
    color: "bg-emerald-50 text-emerald-600",
    title: "Agro & Agrotecnología",
    desc: "Modernización del agro con IICA, tecnificación de cadenas de frío, innovación agrotech y apertura de mercados.",
    href: "/nuestro-trabajo/agro",
    linkLabel: "Iniciativas Agrícolas",
  },
  {
    icon: Coffee,
    color: "bg-amber-50 text-amber-700",
    title: "Turismo Sostenible",
    desc: "Desarrollo y consolidación del Circuito del Café, agroturismo, senderismo en Tierras Altas y turismo cultural.",
    href: "/nuestro-trabajo/turismo",
    linkLabel: "Circuito del Café",
  },
  {
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-700",
    title: "Educación y Talento",
    desc: "Convenio y sinergias con ITSE Panamá, universidades regionales y formación técnica en competencias productivas.",
    href: "/nuestro-trabajo/educacion",
    linkLabel: "Programas de Educación",
  },
  {
    icon: Layers,
    color: "bg-sky-50 text-sky-700",
    title: "Gestión Territorial & Estudios",
    desc: "Infraestructura logística, proyectos de puertos multimodales, monitoreo urbano y publicaciones estadísticas.",
    href: "/nuestro-trabajo/gestion-territorial",
    linkLabel: "Territorio e Infraestructura",
  },
];

const centers = [
  {
    code: "CCE",
    name: "CECOMCE",
    region: "Colón y Región Oriental",
    desc: "Impulso a la logística portuaria, zona franca y desarrollo productivo caribeño.",
    href: "/red-de-centros/cecomce",
    color: "bg-primary-600",
  },
  {
    code: "CCR",
    name: "CECOMCRO",
    region: "Región Central",
    desc: "Fomento agroindustrial y comercial para Coclé, Herrera, Los Santos y Veraguas.",
    href: "/red-de-centros/cecomcro",
    color: "bg-accent-500",
  },
];

export default async function HomePage() {
  const [banners, posts, stats, sobreImage] = await Promise.all([
    getBanners(),
    getPosts(),
    getHomeStats(),
    getSiteSetting("sobre_home_image"),
  ]);

  return (
    <>
      <Hero banners={banners} />

      {/* Cifras clave */}
      <section className="relative z-30 mx-auto -mt-8 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-line bg-white p-6 text-center shadow-xl shadow-slate-200/70 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.id} className={i < stats.length - 1 ? "md:border-r md:border-line" : ""}>
                <span
                  className={`block text-3xl font-bold sm:text-4xl ${
                    i % 4 === 1
                      ? "text-accent-500"
                      : i % 4 === 3
                        ? "text-slate-800"
                        : "text-primary-700"
                  }`}
                >
                  {s.value}
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Sobre CECOM RO */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Sobre Nosotros
              </p>
              <h2 className="mt-2 text-3xl font-bold text-primary-700">
                CECOM RO
              </h2>
              <h3 className="mt-1 text-lg font-semibold text-slate-700 sm:text-xl">
                Centro de Competitividad de la Región Occidental de Panamá
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  El Centro de Competitividad de la Región Occidental de Panamá
                  (CECOM-RO) es una Fundación privada sin ánimo de lucro que
                  nace gracias al impulso de{" "}
                  <strong className="text-slate-800">APEDE</strong>, la{" "}
                  <strong className="text-slate-800">
                    Cámara de Comercio, Industrias y Agricultura de Chiriquí
                  </strong>{" "}
                  y la{" "}
                  <strong className="text-slate-800">
                    Fundación Pro-Chiriquí
                  </strong>
                  , formada por un grupo de empresarios comprometidos con el
                  desarrollo de la región, que son sus socios fundadores.
                </p>
                <p>
                  La creación del centro cuenta con el apoyo especial de{" "}
                  <strong className="text-slate-800">
                    CAF, Banco de Desarrollo de América Latina
                  </strong>
                  , y el{" "}
                  <strong className="text-slate-800">
                    Instituto Interamericano de Cooperación para la Agricultura
                  </strong>
                  , así como con la colaboración de diversas agencias de
                  cooperación internacional e instituciones de financiación
                  multilateral.
                </p>
              </div>
              <Link
                href="/nosotros/quienes-somos"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-accent-500 transition hover:text-primary-700"
              >
                Conocer estructura y antecedentes completos
                <ArrowRight size={14} />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                {sobreImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sobreImage}
                    alt="Sobre CECOM-RO"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
                    alt="Sobre CECOM-RO"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ejes Estratégicos */}
      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Ejes Estratégicos
              </p>
              <h2 className="mt-1 text-2xl font-bold text-primary-700 sm:text-3xl">
                Líneas de Acción Institucional
              </h2>
              <p className="mt-2 text-sm text-muted">
                Proyectos y programas formulados para elevar la productividad,
                la sostenibilidad y el bienestar en la Región Occidental.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {axes.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.color}`}
                    >
                      <a.icon size={24} />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {a.desc}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-line pt-3">
                    <Link
                      href={a.href}
                      className="flex items-center justify-between text-xs font-bold text-primary-700 transition hover:text-accent-500"
                    >
                      {a.linkLabel}
                      <ChevronRight size={14} />
                    </Link>
                    {a.subs && (
                      <div className="mt-2 space-y-1">
                        {a.subs.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className="block text-[11px] text-muted transition hover:text-accent-500"
                          >
                            • {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Red de Centros Regionales */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-8 max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                Articulación Nacional
              </p>
              <h2 className="mt-1 text-xl font-bold text-primary-700 sm:text-2xl">
                Red de Centros Regionales
              </h2>
            </div>
          </Reveal>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {centers.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <Link
                  href={c.href}
                  className="block rounded-2xl border border-line bg-surface p-6 transition hover:border-primary-300 hover:bg-white hover:shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${c.color}`}
                    >
                      {c.code}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-muted">{c.region}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{c.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Noticias recientes */}
      {posts.length > 0 && (
        <section className="border-t border-line bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                    Actualidad
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-primary-700 sm:text-3xl">
                    Noticias recientes
                  </h2>
                </div>
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-accent-500"
                >
                  Ver todas
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <Link
                    href={`/noticias/${post.slug}`}
                    className="group block overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-primary-100">
                      {post.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-primary-400">
                          <span className="text-2xl font-bold">CECOM-RO</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium text-muted">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-primary-800 group-hover:text-accent-500">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
