"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Compass,
  FileText,
  FolderOpen,
  GitBranch,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/logo";

interface NavGroup {
  label: string;
  subheader?: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}

const groups: NavGroup[] = [
  {
    label: "General",
    items: [{ href: "/admin", label: "Panel", icon: LayoutDashboard }],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/inicio", label: "Edición Inicio", icon: LayoutDashboard },
      { href: "/admin/vision-pais", label: "Visión País", icon: Compass },
      { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
      { href: "/admin/categorias", label: "Categorías", icon: FolderOpen },
      { href: "/admin/galeria", label: "Galería de medios", icon: ImageIcon },
      { href: "/admin/paginas", label: "Páginas", icon: FileText },
    ],
  },
  {
    label: "Institucional",
    items: [
      { href: "/admin/junta", label: "Junta Directiva", icon: Users },
      { href: "/admin/equipo", label: "Equipo Ejecutivo", icon: Users },
      { href: "/admin/comisiones", label: "Comisiones", icon: GitBranch },
      { href: "/admin/asociados", label: "Asociados y Aliados", icon: Building2 },
    ],
  },
  {
    label: "Cooperación AECID",
    items: [
      { href: "/admin/vacantes", label: "Vacantes", icon: Briefcase },
      { href: "/admin/compras", label: "Portal de Compras", icon: ShoppingCart },
    ],
  },
  {
    label: "Configuración",
    subheader: "Header",
    items: [
      { href: "/admin/topbar", label: "Top Header", icon: Settings },
      { href: "/admin/header", label: "Header", icon: Settings },
      { href: "/admin/menu", label: "Bottom Header", icon: Settings },
    ],
  },
];

export function AdminShell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createBrowserSupabase().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <LogoMark className="h-9 w-9 rounded-lg bg-white/10 text-white" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">CECOM-RO</p>
          <p className="text-[11px] text-primary-200">Administración</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-300/70">
              {group.label}
            </p>
            {group.subheader && (
              <p className="px-4 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-300/55">
                {group.subheader}
              </p>
            )}
            <ul className={cn("space-y-0.5", group.subheader && "pl-2")}>
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-white/10 text-white"
                          : "text-primary-100/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon size={17} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
            {email?.charAt(0).toUpperCase() ?? "A"}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-primary-100">
            {email}
          </span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-100/80 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-primary-900 lg:block">
        {sidebar}
      </aside>

      {/* Sidebar móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-primary-950/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-primary-900 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-xs font-medium text-muted hover:text-primary-700 sm:flex"
            >
              Ver sitio web
            </Link>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-primary-300 hover:text-primary-700 lg:hidden"
          >
            <LogOut size={14} />
            Salir
          </button>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
