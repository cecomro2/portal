import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { SocialIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site-config";
import type { SocialLink } from "@/lib/site-config";

export function Footer({ socials }: { socials: SocialLink[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-4 border-accent-500 bg-slate-900 pb-6 pt-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-primary-700 text-sm font-bold text-white">
                <span className="text-accent-400">C</span>R
              </span>
              <span className="text-lg font-bold text-white">CECOM RO</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Fundación Centro de Competitividad de la Región Occidental de
              Panamá. Entidad de interés privado sin fines de lucro fundada en
              2015.
            </p>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <MapPin size={14} className="text-accent-400" />
              Ubicación
            </h3>
            <p className="mt-3 space-y-0.5 text-xs leading-relaxed text-slate-300">
              {CONTACT.location.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>

          {/* Horario */}
          <div>
            <h3 className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <Clock size={14} className="text-accent-400" />
              Horario
            </h3>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              {CONTACT.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Teléfonos y redes */}
          <div className="space-y-5">
            <div>
              <h3 className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-xs font-bold uppercase tracking-widest text-white">
                <Phone size={14} className="text-accent-400" />
                Teléfonos
              </h3>
              {CONTACT.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/[^+\d]/g, "")}`}
                  className="mt-3 inline-block text-xs font-bold text-white transition hover:text-accent-400"
                >
                  {p}
                </a>
              ))}
            </div>
            <div>
              <h3 className="border-b border-slate-800 pb-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Redes Sociales
              </h3>
              <div className="mt-3 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-300 transition hover:bg-primary-600 hover:text-white"
                  >
                    <SocialIcon platform={s.platform} width={14} height={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>
            © {year}. Centro de Competitividad de la Región Occidental.
            CECOMRO.
          </p>
          <div className="flex gap-4 text-[11px]">
            <Link href="/nosotros/quienes-somos" className="hover:text-white">
              Quiénes Somos
            </Link>
            <Link href="/contacto" className="hover:text-white">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
