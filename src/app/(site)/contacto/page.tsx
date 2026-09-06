import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { CONTACT } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        kicker="Cecomro"
        title="Contacto"
        subtitle="Escríbenos o visítanos. Estamos para servir a la región occidental de Panamá."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <Reveal className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary-800">Ubicación</h3>
                    {CONTACT.location.map((l) => (
                      <p key={l} className="text-sm text-muted">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Clock size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary-800">Horario</h3>
                    {CONTACT.hours.map((h) => (
                      <p key={h} className="text-sm text-muted">
                        {h}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Phone size={20} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary-800">Teléfonos</h3>
                    {CONTACT.phones.map((p) => (
                      <p key={p} className="text-sm text-muted">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-3">
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <h2 className="text-xl font-bold text-primary-800">
                  Envíanos un mensaje
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Completa el formulario y te responderemos a la brevedad.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
