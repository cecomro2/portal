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

export default function HeaderAdminPage() {
  const router = useRouter();
  const [logo, setLogo] = useState("/logo-cecomro.png");
  const [itseUrl, setItseUrl] = useState("https://www.itse.ac.pa");
  const [circuitoUrl, setCircuitoUrl] = useState("https://circuitodelcafe.com/");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["header_logo", "itse_url", "circuito_url"])
      .then(({ data }) => {
        for (const row of data ?? []) {
          if (row.key === "header_logo" && row.value) setLogo(row.value);
          if (row.key === "itse_url" && row.value) setItseUrl(row.value);
          if (row.key === "circuito_url" && row.value) setCircuitoUrl(row.value);
        }
      });
  }, []);

  async function save() {
    setSaving(true);
    setMsg("");
    const [a, b, c] = await Promise.all([
      saveSiteSetting("header_logo", logo),
      saveSiteSetting("itse_url", itseUrl),
      saveSiteSetting("circuito_url", circuitoUrl),
    ]);
    setSaving(false);
    if (a.ok && b.ok && c.ok) {
      setMsg("Header guardado correctamente.");
    } else {
      setMsg("Ocurrió un error al guardar.");
    }
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Header"
        subtitle="Configura el logo y los enlaces de los aliados del header principal."
      />

      <Card>
        <div className="grid gap-5">
          <Field label="Logo">
            <ImageUpload value={logo} onChange={setLogo} />
          </Field>
          <Field label="Enlace ITSE Panamá">
            <input
              value={itseUrl}
              onChange={(e) => setItseUrl(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Enlace Circuito del Café">
            <input
              value={circuitoUrl}
              onChange={(e) => setCircuitoUrl(e.target.value)}
              className={inputClass}
            />
          </Field>

          {msg && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
              {msg}
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
