import {
  getHeaderSettings,
  getMenuItems,
  getSocials,
  getTopbarLinks,
  getVisions,
} from "@/lib/data";
import { withMenu, withVisions } from "@/lib/site-config";
import { TopBar } from "@/components/site/top-bar";
import { Header } from "@/components/site/header";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { QuickHelp } from "@/components/site/quick-help";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [links, socials, visions, header, menuItems] = await Promise.all([
    getTopbarLinks(),
    getSocials(),
    getVisions(),
    getHeaderSettings(),
    getMenuItems(),
  ]);

  const nav = withVisions(visions, withMenu(menuItems));

  return (
    <>
      <TopBar links={links} socials={socials} />
      <Header
        links={links}
        socials={socials}
        nav={nav}
        logoUrl={header.logo}
        itseUrl={header.itseUrl}
        itseTitle={header.itseTitle}
        itseSubtitle={header.itseSubtitle}
        itseIcon={header.itseIcon}
        circuitoUrl={header.circuitoUrl}
        circuitoTitle={header.circuitoTitle}
        circuitoSubtitle={header.circuitoSubtitle}
        circuitoIcon={header.circuitoIcon}
      />
      <SiteNav nav={nav} />
      <main className="flex-1">{children}</main>
      <Footer socials={socials} />
      <QuickHelp />
    </>
  );
}
