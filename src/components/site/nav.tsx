"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { mainNav, NAV_ICONS, type NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function NavIcon({ name, size = 15 }: { name: string; size?: number }) {
  const Icon = NAV_ICONS[name];
  return Icon ? <Icon size={size} className="text-muted" /> : null;
}

function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Un ítem es activo si una de sus hojas coincide con la ruta actual. */
function itemIsActive(item: NavItem, pathname: string): boolean {
  if (item.children?.length) {
    return item.children.some((c) => itemIsActive(c, pathname));
  }
  return isActive(pathname, item.href);
}

function DropdownChild({ child }: { child: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = itemIsActive(child, pathname);
  const hasChildren = Boolean(child.children?.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        href={child.href}
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition",
          active
            ? "bg-primary-50 font-semibold text-primary-700"
            : "text-ink hover:bg-surface hover:text-primary-700",
        )}
      >
        <span className="flex items-center gap-2">
          {child.icon && <NavIcon name={child.icon} />}
          {child.label}
        </span>
        {hasChildren && <ChevronRight size={14} className="text-muted" />}
      </NavLink>

      {open && hasChildren && (
        <div className="absolute left-full top-0 z-50 pl-1">
          <div className="min-w-[220px] rounded-xl border-l-2 border-accent-500 bg-white py-2 shadow-xl ring-1 ring-black/5">
            {child.children!.map((gc) => (
              <DropdownChild key={gc.href} child={gc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = itemIsActive(item, pathname);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex h-full items-center px-3 text-[13px] font-medium tracking-wide transition",
          active
            ? "text-white"
            : "text-primary-100/90 hover:bg-primary-500 hover:text-white",
        )}
      >
        {item.label}
        {active && (
          <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-t bg-accent-400" />
        )}
      </Link>
    );
  }

  return (
    <div
      className="relative flex h-full items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "flex h-full items-center gap-1 px-3 text-[13px] font-medium tracking-wide transition",
          active
            ? "text-white"
            : "text-primary-100/90 hover:bg-primary-500 hover:text-white",
        )}
      >
        {item.label}
        <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-1">
          <div className="min-w-[240px] rounded-b-xl border-t-2 border-accent-500 bg-white py-2 shadow-xl ring-1 ring-black/5">
            {item.children.map((child) => (
              <DropdownChild key={child.href} child={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteNav({ nav = mainNav }: { nav?: NavItem[] }) {
  return (
    <div className="sticky top-0 z-40 hidden bg-primary-600 shadow-md lg:block">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-12 max-w-7xl items-center justify-center px-2 xl:px-4"
      >
        <ul className="flex h-full items-stretch">
          {nav.map((item) => (
            <DesktopItem key={item.href} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
