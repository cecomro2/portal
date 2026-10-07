import { SiteShell } from "@/components/site/site-shell";

// El contenido público es común para todos los visitantes. Se sirve desde la
// caché de Next/Vercel y se regenera como respaldo cada hora. Las acciones del
// panel administrativo ya invalidan las rutas afectadas con revalidatePath.
export const dynamic = "force-static";
export const revalidate = 3600;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
