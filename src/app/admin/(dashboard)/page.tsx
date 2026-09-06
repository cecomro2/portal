import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  GitBranch,
  Image as ImageIcon,
  Newspaper,
  ShoppingCart,
  Users,
} from "lucide-react";
import { createServiceSupabase } from "@/lib/supabase/server";
import { AdminPageHeader, Card } from "@/components/admin/ui";

const quickLinks = [
  { href: "/admin/banner", label: "Banner de inicio", icon: ImageIcon },
  { href: "/admin/vacantes", label: "Vacantes AECID", icon: Briefcase },
  { href: "/admin/compras", label: "Portal de Compras", icon: ShoppingCart },
  { href: "/admin/junta", label: "Junta Directiva", icon: Users },
  { href: "/admin/equipo", label: "Equipo Ejecutivo", icon: Users },
  { href: "/admin/comisiones", label: "Comisiones", icon: GitBranch },
  { href: "/admin/galeria", label: "Galería de medios", icon: ImageIcon },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
];

export default async function DashboardPage() {
  const supabase = createServiceSupabase();

  const [banners, posts, media, board, team, associates, postings] =
    await Promise.all([
      supabase.from("banners").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("media_items").select("id", { count: "exact", head: true }),
      supabase.from("board_members").select("id", { count: "exact", head: true }),
      supabase.from("executive_team").select("id", { count: "exact", head: true }),
      supabase.from("associates").select("id", { count: "exact", head: true }),
      supabase.from("postings").select("type"),
    ]);

  const vacantes = postings.data?.filter((p) => p.type === "vacancy").length ?? 0;
  const compras =
    postings.data?.filter((p) => p.type === "procurement").length ?? 0;

  const stats = [
    { label: "Banners", value: banners.count ?? 0, href: "/admin/banner" },
    { label: "Vacantes", value: vacantes, href: "/admin/vacantes" },
    { label: "Compras", value: compras, href: "/admin/compras" },
    { label: "Noticias", value: posts.count ?? 0, href: "/admin/noticias" },
    { label: "Medios", value: media.count ?? 0, href: "/admin/galeria" },
    { label: "Junta", value: board.count ?? 0, href: "/admin/junta" },
    { label: "Equipo", value: team.count ?? 0, href: "/admin/equipo" },
    { label: "Asociados", value: associates.count ?? 0, href: "/admin/asociados" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Panel de administración"
        subtitle="Gestiona el contenido del sitio web de CECOM-RO."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-3xl font-bold text-primary-700">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold text-primary-800">
        Accesos rápidos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-accent-500 group-hover:text-white">
              <l.icon size={20} />
            </span>
            <span className="flex-1 text-sm font-semibold text-primary-800">
              {l.label}
            </span>
            <ArrowRight
              size={16}
              className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-500"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
