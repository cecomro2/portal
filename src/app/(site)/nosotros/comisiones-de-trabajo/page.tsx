import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { OrgChart } from "@/components/site/org-chart";
import { Reveal } from "@/components/site/reveal";
import { getCommissions, getCommissionMembers } from "@/lib/data";

export const metadata: Metadata = { title: "Comisiones de Trabajo" };

export default async function ComisionesPage() {
  const [commissions, members] = await Promise.all([
    getCommissions(),
    getCommissionMembers(),
  ]);

  return (
    <>
      <PageHeader
        kicker="Nosotros"
        title="Comisiones de Trabajo"
        subtitle="Estructura organizativa de las comisiones que articulan el trabajo del Centro."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {commissions.length ? (
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
                <OrgChart commissions={commissions} members={members} />
              </div>
            </Reveal>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              El organigrama de comisiones estará disponible próximamente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
