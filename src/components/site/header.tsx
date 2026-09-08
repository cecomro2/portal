"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SocialIcon } from "@/components/icons";
import { mainNav, NAV_ICONS, TOPBAR_ICONS, type NavItem, type SocialLink } from "@/lib/site-config";
import type { HeaderItem, TopbarLink } from "@/lib/types";
import { cn } from "@/lib/utils";

function NavIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = NAV_ICONS[name];
  return Icon ? <Icon size={size} className="text-muted" /> : null;
}

function DrawerNavItem({
  item,
  openKeys,
  onToggle,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  openKeys: Set<string>;
  onToggle: (key: string) => void;
  depth?: number;
  onNavigate: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = openKeys.has(item.href);

  if (hasChildren) {
    const labelClasses = cn(
      "flex flex-1 items-center gap-2 py-3 text-left text-sm font-medium transition hover:text-primary-700",
      depth === 0 ? "text-ink" : "text-muted",
    );
    return (
      <div>
        <div className="flex items-center">
          {item.href.startsWith("http") ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
              className={labelClasses}
            >
              {item.icon && <NavIcon name={item.icon} />}
              {item.label}
            </a>
          ) : (
            <Link href={item.href} onClick={onNavigate} className={labelClasses}>
              {item.icon && <NavIcon name={item.icon} />}
              {item.label}
            </Link>
          )}
          <button
            type="button"
            onClick={() => onToggle(item.href)}
            aria-label={isOpen ? "Contraer submenú" : "Expandir submenú"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-primary-700"
          >
            <ChevronDown
              size={16}
              className={cn("transition", isOpen && "rotate-180")}
            />
          </button>
        </div>

        {isOpen && (
          <div className="mb-2 ml-3 border-l border-line pl-3">
            {item.children!.map((child) => (
              <DrawerNavItem
                key={child.href}
                item={child}
                openKeys={openKeys}
                onToggle={onToggle}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {item.href.startsWith("http") ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 py-3 text-sm font-medium transition hover:text-primary-700",
            depth === 0 ? "text-ink" : "text-muted",
          )}
        >
          {item.icon && <NavIcon name={item.icon} />}
          {item.label}
        </a>
      ) : (
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 py-3 text-sm font-medium transition hover:text-primary-700",
            depth === 0 ? "text-ink" : "text-muted",
          )}
        >
          {item.icon && <NavIcon name={item.icon} />}
          {item.label}
        </Link>
      )}
    </div>
  );
}

export function Header({
  links,
  socials,
  nav = mainNav,
  logoUrl = "/logo-cecomro.png",
  items = [],
}: {
  links: TopbarLink[];
  socials: SocialLink[];
  nav?: NavItem[];
  logoUrl?: string;
  items?: HeaderItem[];
}) {
  const [open, setOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const navLinks = links.filter(
    (l) => l.kind === "link" && l.is_active && !/itse/i.test(l.label),
  );
  const close = () => {
    setOpen(false);
    setOpenKeys(new Set());
  };

  return (
    <header className="relative z-50 border-b border-line bg-white py-3.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo src={logoUrl} />

        <div className="flex items-center gap-3">
          {/* Elementos del header (desktop) */}
          <div className="hidden items-center gap-3 lg:flex">
            {items.map((item) => {
              const Icon = item.icon ? TOPBAR_ICONS[item.icon] : null;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.title}
                  className="group flex items-center gap-2.5 rounded-lg border border-line bg-surface/80 px-3 py-1.5 transition hover:border-primary-300"
                >
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-7 w-7 shrink-0 rounded object-contain"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-primary-600 text-white">
                      {Icon && <Icon size={14} />}
                    </span>
                  )}
                  <span className="flex flex-col text-left">
                    <span className="text-[11px] font-bold uppercase leading-none tracking-tight text-primary-700 transition group-hover:text-accent-500">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[9px] font-medium text-muted">
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Hamburguesa (móvil) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition hover:bg-surface lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Drawer lateral (derecha) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={cn(
            "absolute inset-0 bg-primary-950/50 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line bg-primary-600 px-4 py-3.5">
            <span className="text-sm font-semibold text-white">CECOM-RO</span>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-primary-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {nav.map((item) => (
              <DrawerNavItem
                key={item.href}
                item={item}
                openKeys={openKeys}
                onToggle={(key) =>
                  setOpenKeys((prev) => {
                    const next = new Set(prev);
                    if (next.has(key)) next.delete(key);
                    else next.add(key);
                    return next;
                  })
                }
                onNavigate={close}
              />
            ))}

            <div className="my-4 border-t border-line" />

            <nav className="space-y-1" aria-label="Enlaces superiores">
              {navLinks.map((l) => (
                <Link
                  key={l.id}
                  href={l.href}
                  target={l.is_external ? "_blank" : undefined}
                  rel={l.is_external ? "noopener noreferrer" : undefined}
                  onClick={close}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-surface"
                >
                  {l.label}
                </Link>
              ))}
              {items.map((item) => {
                const Icon = item.icon ? TOPBAR_ICONS[item.icon] : null;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-surface"
                  >
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-6 w-6 shrink-0 rounded object-contain"
                      />
                    ) : (
                      Icon && <Icon size={16} className="text-muted" />
                    )}
                    {item.title}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-ink transition hover:bg-primary-600 hover:text-white"
                >
                  <SocialIcon platform={s.platform} width={16} height={16} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
