"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { saveSiteSetting } from "@/lib/actions/settings";
import {
  AdminPageHeader,
  Card,
  Field,
  inputClass,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { IconPicker } from "@/components/admin/icon-picker";

const DEFAULTS = {
  logo: "/logo-cecomro.png",
  itseUrl: "https://www.itse.ac.pa",
  itseTitle: "ITSE Panamá",
  itseSubtitle: "Educación Superior",
  itseIcon: "graduation-cap",
  circuitoUrl: "https://circuitodelcafe.com/",
  circuitoTitle: "Circuito del Café",
  circuitoSubtitle: "Tierras Altas • Boquete",
  circuitoIcon: "coffee",
};

const KEYS = [
  "header_logo",
  "itse_url",
  "itse_title",
  "itse_subtitle",
  "itse_icon",
  "circuito_url",
  "circuito_title",
  "circuito_subtitle",
  "circuito_icon",
] as const;

export default function HeaderAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [...KEYS])
      .then(({ data }) => {
        const map = new Map((data ?? []).map((r) => [r.key, r.value]));
        setForm((f) => ({
          logo: map.get("header_logo") || f.logo,
          itseUrl: map.get("itse_url") || f.itseUrl,
          itseTitle: map.get("itse_title") || f.itseTitle,
          itseSubtitle: map.get("itse_subtitle") || f.itseSubtitle,
          itseIcon: map.get("itse_icon") || f.itseIcon,
          circuitoUrl: map.get("circuito_url") || f.circuitoUrl,
          circuitoTitle: map.get("circuito_title") || f.circuitoTitle,
          circuitoSubtitle: map.get("circuito_subtitle") || f.circuitoSubtitle,
          circuitoIcon: map.get("circuito_icon") || f.circuitoIcon,
        }));
      });
  }, []);

  function set<K extends keyof typeof DEFAULTS>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    setError("");
    const entries: [string, string][] = [
      ["header_logo", form.logo],
      ["itse_url", form.itseUrl],
      ["itse_title", form.itseTitle],
      ["itse_subtitle", form.itseSubtitle],
      ["itse_icon", form.itseIcon],
      ["circuito_url", form.circuitoUrl],
      ["circuito_title", form.circuitoTitle],
      ["circuito_subtitle", form.circuitoSubtitle],
      ["circuito_icon", form.circuitoIcon],
    ];
    const results = await Promise.all(
      entries.map(([key, value]) => saveSiteSetting(key, value)),
    );
    setSaving(false);
    if (results.every((r) => r.ok)) {
      setMsg("Header guardado correctamente.");
    } else {
      setError("Ocurrió un error al guardar.");
    }
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Header"
        subtitle="Configura el logo y los dos elementos aliados (título, subtítulo, enlace e icono) del header principal."
      />

      <Card>
        <div className="grid gap-6">
          <Field label="Logo">
            <ImageUpload value={form.logo} onChange={(v) => set("logo", v)} />
          </Field>

          <div className="border-t border-line pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              ITSE Panamá
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Título">
                <input
                  value={form.itseTitle}
                  onChange={(e) => set("itseTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  value={form.itseSubtitle}
                  onChange={(e) => set("itseSubtitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Enlace">
                <input
                  value={form.itseUrl}
                  onChange={(e) => set("itseUrl", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Icono">
                <IconPicker
                  value={form.itseIcon}
                  onChange={(v) => set("itseIcon", v)}
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Circuito del Café
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Título">
                <input
                  value={form.circuitoTitle}
                  onChange={(e) => set("circuitoTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  value={form.circuitoSubtitle}
                  onChange={(e) => set("circuitoSubtitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Enlace">
                <input
                  value={form.circuitoUrl}
                  onChange={(e) => set("circuitoUrl", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Icono">
                <IconPicker
                  value={form.circuitoIcon}
                  onChange={(v) => set("circuitoIcon", v)}
                />
              </Field>
            </div>
          </div>

          {msg && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
              {msg}
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-700">
              {error}
            </p>
          )}

          <div>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar header"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
