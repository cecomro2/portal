"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface TimelineEntry {
  period: string;
  title: string;
  details: string[];
}

/**
 * Línea de tiempo vertical animada: la línea se dibuja (conecta los puntos)
 * al hacer scroll y se revierte al subir.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Línea base */}
      <div className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-line" />
      {/* Línea de progreso (animada) */}
      <div
        ref={lineRef}
        className="absolute bottom-2 left-[19px] top-2 w-0.5 origin-top bg-primary-600"
        style={{ transform: "scaleY(0)" }}
      />

      <ol className="space-y-8">
        {entries.map((entry, i) => (
          <li key={i} className="relative pl-12">
            {/* Punto */}
            <span className="absolute left-5 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary-600 bg-white" />

            <span className="block text-xs font-bold uppercase tracking-wider text-accent-500">
              {entry.period}
            </span>
            <h3 className="mt-1 text-base font-semibold leading-snug text-primary-800">
              {entry.title}
            </h3>
            {entry.details.length > 0 && (
              <ul className="mt-2 space-y-1">
                {entry.details.map((d, j) => (
                  <li key={j} className="text-sm text-muted">
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
