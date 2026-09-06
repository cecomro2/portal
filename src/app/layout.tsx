import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cecomro.com"),
  title: {
    default: "CECOM-RO · Centro de Competitividad de la Región Occidental",
    template: "%s · CECOM-RO",
  },
  description:
    "El Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO) impulsa la posición competitiva de la región occidental, articulando esfuerzos públicos y privados.",
  keywords: [
    "Cecomro",
    "CECOM-RO",
    "competitividad",
    "Región Occidental",
    "Chiriquí",
    "Panamá",
  ],
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://cecomro.com",
    siteName: "CECOM-RO",
    title: "CECOM-RO · Centro de Competitividad de la Región Occidental",
    description:
      "Impulsamos la posición competitiva de la Región Occidental de Panamá.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
