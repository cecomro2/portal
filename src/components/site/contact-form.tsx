"use client";

import { useState } from "react";
import Script from "next/script";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  "0x4AAAAAAFMERkajYj7BGyE8";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [mountedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const tokenInput = form.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]',
    );
    if (!tokenInput?.value) {
      setStatus("error");
      setError("Por favor completa la verificación de seguridad.");
      return;
    }
    const res = await submitContact(new FormData(form));
    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setError(res.error ?? "Ocurrió un error.");
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Nombre *
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Correo electrónico *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Asunto
        </label>
        <input
          name="subject"
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          placeholder="Motivo del mensaje"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Mensaje *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          placeholder="Escribe tu mensaje…"
        />
      </div>

      {/* Anti-spam: campo trampa invisible para bots */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">No llenar este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="ts" value={mountedAt} />

      {/* Verificación Cloudflare Turnstile */}
      <div
        className="cf-turnstile"
        data-sitekey={TURNSTILE_SITE_KEY}
        data-theme="light"
      />

      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          Mensaje enviado correctamente. Gracias por contactarnos.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        Enviar mensaje
      </button>
      </form>
    </>
  );
}
