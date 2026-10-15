import { EcosystemManager } from "@/components/admin/ecosystem-manager";
import { getSiteSetting } from "@/lib/data";
import { ECOSYSTEM_KEY, parseEcosystem } from "@/lib/ecosystem";
export default async function Page() { return <EcosystemManager initial={parseEcosystem(await getSiteSetting(ECOSYSTEM_KEY))} />; }
