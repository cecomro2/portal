import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Posting } from "@/lib/types";

/** Estado efectivo de una vacante/compra (considera la fecha de cierre). */
export function postingStatus(p: Posting): "abierta" | "cerrada" {
  if (!p.is_active) return "cerrada";
  if (!p.closing_date) return "abierta";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const close = new Date(p.closing_date);
  close.setHours(0, 0, 0, 0);
  return close >= today ? "abierta" : "cerrada";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Genera un slug seguro a partir de un texto en español. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extrae el ID de un video de YouTube desde distintos formatos de URL. */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

/** Formatea un tamaño en bytes a una cadena legible. */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Elimina etiquetas HTML y devuelve texto plano. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normaliza texto para búsquedas: minúsculas y sin acentos. */
export function normalize(input: string | null | undefined): string {
  return (input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Divide una consulta en términos normalizados (ignora signos de puntuación). */
export function searchTerms(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9ñ]+/i)
    .filter(Boolean);
}

/** Devuelve una fecha relativa en español ("hace 4 horas"). */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "";
  const seconds = Math.floor((Date.now() - d) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return days === 1 ? "hace 1 día" : `hace ${days} días`;
  if (hours > 0) return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
  if (minutes > 0) return minutes === 1 ? "hace 1 minuto" : `hace ${minutes} minutos`;
  return "hace un momento";
}

/** Formatea una fecha ISO a formato legible en español. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-PA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
