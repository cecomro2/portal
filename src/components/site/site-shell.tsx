import { getSocials, getTopbarLinks, getVisions } from "@/lib/data";
import { withVisions } from "@/lib/site-config";
import { TopBar } from "@/components/site/top-bar";
import { Header } from "@/components/site/header";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [links, socials, visions] = await Promise.all([
    getTopbarLinks(),
    getSocials(),
    getVisions(),
  ]);

  const nav = withVisions(visions);

  return (
    <>
      <TopBar links={links} socials={socials} />
      <Header links={links} socials={socials} nav={nav} />
      <SiteNav nav={nav} />
      <main className="flex-1">{children}</main>
      <Footer socials={socials} />
    </>
  );
}
