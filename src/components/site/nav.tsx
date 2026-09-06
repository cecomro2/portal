"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { mainNav, NAV_ICONS, type NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/site/search-modal";

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

function DesktopItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);

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
    <div className="group relative flex h-full items-center">
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
        <ChevronDown size={14} className="transition group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-0 top-full z-50 min-w-[240px] translate-y-2 pt-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="rounded-b-xl border-t-2 border-accent-500 bg-white py-2 shadow-xl ring-1 ring-black/5">
          {item.children.map((child) => (
            <DropdownChild key={child.href} child={child} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DropdownChild({ child }: { child: NavItem }) {
  const pathname = usePathname();
  const active = isActive(pathname, child.href);
  const hasGrandchildren = Boolean(child.children?.length);

  return (
    <div className="group/sub relative">
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
        {hasGrandchildren && (
          <ChevronRight size={14} className="text-muted" />
        )}
      </NavLink>

      {hasGrandchildren && (
        <div className="invisible absolute left-full top-0 z-50 ml-0 min-w-[220px] -translate-x-1 pl-1 opacity-0 transition-all duration-150 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100">
          <div className="rounded-xl border-l-2 border-accent-500 bg-white py-2 shadow-xl ring-1 ring-black/5">
            {child.children!.map((gc) => (
              <NavLink
                key={gc.href}
                href={gc.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm transition",
                  isActive(pathname, gc.href)
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "text-ink hover:bg-surface hover:text-primary-700",
                )}
              >
                {gc.icon && <NavIcon name={gc.icon} />}
                {gc.label}
              </NavLink>
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
        className="mx-auto flex h-12 max-w-7xl items-center justify-between px-2 xl:px-4"
      >
        <ul className="flex h-full items-stretch">
          {nav.map((item) => (
            <DesktopItem key={item.href} item={item} />
          ))}
        </ul>
        <SearchModal
          className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
        />
      </nav>
    </div>
  );
}
