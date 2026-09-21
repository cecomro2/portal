"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { LogoMark } from "@/components/site/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSending, setForgotSending] = useState(false);

  async function onForgot() {
    setForgotError("");
    setForgotMsg("");
    if (!forgotEmail) {
      setForgotError("Escribe tu correo.");
      return;
    }
    setForgotSending(true);
    const supabase = createBrowserSupabase();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      forgotEmail,
      { redirectTo: `${window.location.origin}/reset-password` },
    );
    setForgotSending(false);
    if (resetError) {
      setForgotError(resetError.message);
      return;
    }
    setForgotMsg(
      "Te enviamos un enlace de recuperación. Revisa tu bandeja de entrada (y el spam).",
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("Credenciales inválidas. Inténtalo nuevamente.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        setError("No tienes permisos de administrador.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Ocurrió un error al iniciar sesión.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-700 via-primary-900 to-primary-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14 rounded-2xl bg-white/10 text-white" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Panel de Administración
          </h1>
          <p className="mt-1 text-sm text-primary-200">
            Centro de Competitividad de la Región Occidental
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        >
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-accent-500" />
            <h2 className="text-lg font-semibold text-primary-800">
              Iniciar sesión
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="correo@cecomro.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Entrar
          </button>
        </form>

        <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
          {!forgotOpen ? (
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="w-full text-center text-sm font-medium text-white transition hover:text-accent-300"
            >
              ¿Olvidaste tu contraseña?
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-primary-100">
                Escribe tu correo y te enviaremos un enlace para restablecerla.
              </p>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="correo@cecomro.com"
                className="w-full rounded-lg border border-white/20 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              {forgotError && (
                <p className="text-xs text-accent-200">{forgotError}</p>
              )}
              {forgotMsg && (
                <p className="text-xs text-emerald-200">{forgotMsg}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onForgot}
                  disabled={forgotSending}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 disabled:opacity-60"
                >
                  {forgotSending ? "Enviando…" : "Enviar enlace"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotOpen(false);
                    setForgotError("");
                    setForgotMsg("");
                  }}
                  className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
