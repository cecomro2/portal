import { SimplePageView } from "@/components/site/simple-page-view";
import { getSimplePageByPath } from "@/lib/data";

const path = "/nuestro-trabajo/gestion-territorial-aecid";
export async function generateMetadata() {
  return { title: (await getSimplePageByPath(path))?.title ?? "Desarrollo Integral CNB" };
}
export default function Page() { return <SimplePageView path={path} />; }
