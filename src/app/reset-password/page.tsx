"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { LogoMark } from "@/components/site/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "done" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const supabase = createBrowserSupabase();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setMessage(
            "El enlace es inválido o ya expiró. Solicita un nuevo enlace de recuperación.",
          );
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setStatus("error");
        setMessage(
          "No se pudo verificar la sesión. Vuelve a solicitar el enlace de recuperación.",
        );
        return;
      }
      setStatus("ready");
    }
    init();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/admin/login"), 2500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-700 via-primary-900 to-primary-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14 rounded-2xl bg-white/10 text-white" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Restablecer contraseña
          </h1>
          <p className="mt-1 text-sm text-primary-200">
            Crea una nueva contraseña para tu cuenta de administrador.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          {status === "loading" && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
              <Loader2 size={18} className="animate-spin" />
              Verificando enlace…
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <p className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
                {message}
              </p>
              <a
                href="/admin/login"
                className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:text-accent-500"
              >
                Volver al inicio de sesión
              </a>
            </div>
          )}

          {status === "done" && (
            <div className="text-center">
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Contraseña actualizada correctamente. Redirigiendo…
              </p>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-accent-500" />
                <h2 className="text-lg font-semibold text-primary-800">
                  Nueva contraseña
                </h2>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  placeholder="••••••••"
                />
              </div>

              {message && (
                <p className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                Guardar contraseña
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
