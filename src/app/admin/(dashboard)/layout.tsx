import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Database size={26} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-primary-800">
            Supabase no está configurado
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Define <code className="rounded bg-surface px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            y <code className="rounded bg-surface px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            en <code className="rounded bg-surface px-1.5 py-0.5 text-xs">.env.local</code>{" "}
            y ejecuta el SQL de <code className="rounded bg-surface px-1.5 py-0.5 text-xs">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
