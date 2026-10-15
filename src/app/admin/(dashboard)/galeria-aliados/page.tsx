import { AssociatesGalleryManager } from "@/components/admin/associates-gallery-manager";
import { getSiteSetting } from "@/lib/data";
import { GALLERY_KEY, parseAssociatesGallery } from "@/lib/ecosystem";
export default async function Page() { return <AssociatesGalleryManager initial={parseAssociatesGallery(await getSiteSetting(GALLERY_KEY))} />; }
