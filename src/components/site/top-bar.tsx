import Link from "next/link";
import { Compass, GraduationCap, Mail, type LucideIcon } from "lucide-react";
import { SocialIcon } from "@/components/icons";
import { SearchModal } from "@/components/site/search-modal";
import type { TopbarLink } from "@/lib/types";
import type { SocialLink } from "@/lib/site-config";

function linkIcon(label: string): LucideIcon | null {
  const key = label.toLowerCase();
  if (key.includes("contacto")) return Mail;
  if (key.includes("itse")) return GraduationCap;
  if (key.includes("vision")) return Compass;
  return null;
}

export function TopBar({
  links,
  socials,
}: {
  links: TopbarLink[];
  socials: SocialLink[];
}) {
  const navLinks = links.filter((l) => l.kind === "link" && l.is_active);

  return (
    <div className="border-b border-slate-200 bg-slate-100 text-xs font-medium text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <SearchModal />

          {navLinks.length > 0 && <span className="text-slate-300">|</span>}

          <nav
            className="hidden flex-wrap items-center gap-3 sm:gap-4 md:flex"
            aria-label="Enlaces superiores"
          >
            {navLinks.map((l, i) => {
              const Icon = linkIcon(l.label);
              return (
                <span key={l.id} className="flex items-center gap-3 sm:gap-4">
                  {i > 0 && <span className="text-slate-300">|</span>}
                  <Link
                    href={l.href}
                    target={l.is_external ? "_blank" : undefined}
                    rel={l.is_external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-1.5 font-semibold text-slate-700 transition hover:text-accent-500"
                  >
                    {Icon && <Icon size={13} className="text-primary-600" />}
                    {l.label}
                  </Link>
                </span>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:inline">
            Síguenos:
          </span>
          {socials.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-primary-600 hover:text-white"
            >
              <SocialIcon platform={s.platform} width={12} height={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
