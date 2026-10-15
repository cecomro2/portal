import { SimplePageView } from "@/components/site/simple-page-view";
import { getSimplePageByPath } from "@/lib/data";

const path = "/nuestro-trabajo/turismo/circuito-del-cafe";
export async function generateMetadata() {
  return { title: (await getSimplePageByPath(path))?.title ?? "Circuito del Café" };
}
export default function Page() { return <SimplePageView path={path} />; }
