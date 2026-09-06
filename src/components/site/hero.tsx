"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Hero({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const dragX = useRef<number | null>(null);

  const count = banners.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6500);
    return () => clearInterval(t);
  }, [count, paused]);

  useEffect(() => {
    const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
    slides.forEach((slide, i) => {
      const texts = slide.querySelectorAll<HTMLElement>("[data-hero-anim]");
      if (i === index) {
        gsap.fromTo(
          slide,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
        );
        gsap.fromTo(
          texts,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.2,
            ease: "power3.out",
          },
        );
      } else {
        gsap.to(slide, { opacity: 0, duration: 0.7, ease: "power1.inOut" });
        gsap.to(texts, { opacity: 0, duration: 0.3 });
      }
    });
  }, [index]);

  const go = (i: number) => setIndex((i + count) % count);

  function onPointerDown(e: React.PointerEvent) {
    dragX.current = e.clientX;
    setPaused(true);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? index + 1 : index - 1);
    dragX.current = null;
    setPaused(false);
  }
  function onPointerLeave() {
    dragX.current = null;
    setPaused(false);
  }

  return (
    <section
      className="relative cursor-grab touch-pan-y overflow-hidden bg-slate-900 active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      aria-label="Presentación"
    >
      <div className="relative flex h-[480px] w-full items-center sm:h-[540px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => {
              slidesRef.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {b.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.image_url}
                alt={b.title}
                className="h-full w-full object-cover object-center brightness-50"
              />
            ) : (
              <div
                className={cn(
                  "h-full w-full",
                  i % 3 === 0 &&
                    "bg-gradient-to-br from-primary-700 via-primary-900 to-primary-950",
                  i % 3 === 1 &&
                    "bg-gradient-to-br from-primary-800 via-primary-950 to-[#2a2140]",
                  i % 3 === 2 &&
                    "bg-gradient-to-br from-[#6a2a3a] via-primary-900 to-primary-950",
                )}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#23286E]/95 via-[#2F358A]/75 to-transparent" />

            <div className="absolute inset-0 z-20 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {b.badge && (
                    <p
                      data-hero-anim
                      className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
                    >
                      <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                      {b.badge}
                    </p>
                  )}
                  <h1
                    data-hero-anim
                    className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
                  >
                    {b.title}
                  </h1>
                  {b.subtitle && (
                    <p
                      data-hero-anim
                      className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base"
                    >
                      {b.subtitle}
                    </p>
                  )}
                  <div
                    data-hero-anim
                    className="mt-7 flex flex-wrap items-center gap-3"
                  >
                    {b.cta_label && (
                      <Link
                        href={b.cta_href ?? "/nosotros/quienes-somos"}
                        className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent-900/30 transition hover:bg-accent-600"
                      >
                        {b.cta_label}
                        <ChevronRight size={16} />
                      </Link>
                    )}
                    <Link
                      href="/nuestro-trabajo/proyectos-de-cooperacion"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white hover:text-primary-800"
                    >
                      <Briefcase size={16} />
                      Proyectos y Convocatorias
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {count > 1 && (
          <div className="absolute bottom-12 right-6 z-20 flex items-center gap-2 sm:right-12">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5 px-1">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-6 bg-accent-500"
                      : "w-2 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
