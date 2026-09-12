import {
  getHeaderItems,
  getHeaderSettings,
  getMenuItems,
  getSimplePages,
  getSocials,
  getTopbarLinks,
  getVisions,
} from "@/lib/data";
import { withMenu, withSimplePages, withVisions } from "@/lib/site-config";
import { TopBar } from "@/components/site/top-bar";
import { Header } from "@/components/site/header";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { QuickHelp } from "@/components/site/quick-help";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [links, socials, visions, simplePages, header, headerItems, menuItems] =
    await Promise.all([
      getTopbarLinks(),
      getSocials(),
      getVisions(),
      getSimplePages(),
      getHeaderSettings(),
      getHeaderItems(),
      getMenuItems(),
    ]);

  const nav = withSimplePages(
    simplePages,
    withVisions(visions, withMenu(menuItems)),
  );

  return (
    <>
      <TopBar links={links} socials={socials} />
      <Header
        links={links}
        socials={socials}
        nav={nav}
        logoUrl={header.logo}
        items={headerItems}
      />
      <SiteNav nav={nav} />
      <main className="flex-1">{children}</main>
      <Footer socials={socials} />
      <QuickHelp />
    </>
  );
}
