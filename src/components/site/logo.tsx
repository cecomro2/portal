"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-white shadow-md shadow-primary-900/20",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9.5" stroke="#C63E43" strokeWidth="2" />
        <path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          stroke="white"
          strokeWidth="1.6"
        />
        <path d="M2.5 12h19" stroke="white" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" fill="#C63E43" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [error, setError] = useState(false);

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="CECOM-RO — Inicio"
    >
      {error ? (
        <>
          <LogoMark className="transition-transform group-hover:scale-105" />
          <span className="flex flex-col leading-tight">
            <span className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
              <span className="text-primary-700">CECOM</span>
              <span className="text-accent-500">RO</span>
            </span>
            {!compact && (
              <span className="hidden max-w-[270px] text-[10px] font-semibold uppercase tracking-wider text-muted sm:block">
                Centro de Competitividad de la Región Occidental
              </span>
            )}
          </span>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo-cecomro.png"
          alt="CECOM-RO"
          onError={() => setError(true)}
          className="h-11 w-auto object-contain lg:h-12"
        />
      )}
    </Link>
  );
}
