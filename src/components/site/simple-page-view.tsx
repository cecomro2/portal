import { notFound } from "next/navigation";
import { getSimplePageByPath } from "@/lib/data";
import { PageHeader } from "@/components/site/page-header";

export async function SimplePageView({ path }: { path: string }) {
  const page = await getSimplePageByPath(path);
  if (!page) notFound();
  return <><PageHeader kicker="Nuestro Trabajo" title={page.title} /><section className="bg-white py-12 lg:py-16"><div className="sp-content mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: page.content }} /></section></>;
}
