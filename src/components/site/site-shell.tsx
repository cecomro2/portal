import {
  getHeaderItems,
  getHeaderSettings,
  getMenuItems,
  getSimplePages,
  getSocials,
  getTopbarLinks,
  getVisions,
  getSiteSetting,
} from "@/lib/data";
import { ECOSYSTEM_KEY, parseEcosystem, visibleEcosystem } from "@/lib/ecosystem";
import { withMenu, withSimplePages, withVisions } from "@/lib/site-config";
import { TopBar } from "@/components/site/top-bar";
import { Header } from "@/components/site/header";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { QuickHelp } from "@/components/site/quick-help";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [links, socials, visions, simplePages, header, headerItems, menuItems, ecosystemRaw] =
    await Promise.all([
      getTopbarLinks(),
      getSocials(),
      getVisions(),
      getSimplePages(),
      getHeaderSettings(),
      getHeaderItems(),
      getMenuItems(),
      getSiteSetting(ECOSYSTEM_KEY),
    ]);

  const baseNav = withSimplePages(
    simplePages,
    withVisions(visions, withMenu(menuItems)),
  );
  const ecosystem = visibleEcosystem(parseEcosystem(ecosystemRaw));
  const nav = baseNav.map((item) => item.key === "trabajo" && ecosystem.length
    ? { ...item, children: [...(item.children ?? []).filter((child) => child.href !== "#ecosistema"), { label: "Ecosistema", href: "#ecosistema", children: ecosystem.map((org) => ({ label: org.name, href: org.url || `#ecosistema-${org.id}` })) }] }
    : item);

  return (
    <>
      <TopBar links={links} socials={socials} />
      <Header
        links={links}
        socials={socials}
        nav={nav}
        logoUrl={header.logo}
        logoHeightMobile={header.logoHeightMobile}
        logoHeightDesktop={header.logoHeightDesktop}
        itemSize={header.itemSize}
        items={headerItems}
      />
      <SiteNav nav={nav} />
      <main className="flex-1">{children}</main>
      <Footer socials={socials} />
      <QuickHelp />
    </>
  );
}
