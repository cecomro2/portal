import { SimplePageView } from "@/components/site/simple-page-view";
import { getSimplePageByPath } from "@/lib/data";

const path = "/nuestro-trabajo/planes-estrategicos-cnb";
export async function generateMetadata() {
  return { title: (await getSimplePageByPath(path))?.title ?? "Planes Estratégicos CNB" };
}
export default function Page() { return <SimplePageView path={path} />; }
