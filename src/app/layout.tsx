import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import { isShopifyConfigured } from "@/lib/shop/config";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Só para títulos (classe `font-display`). Não é variável: carrega apenas os pesos usados. */
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  category: "shopping",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0d0f0c",
  colorScheme: "light",
};

/** sameAs só com perfis reais (um link para a raiz do Instagram não identifica ninguém). */
const profiles = Object.values(site.social).filter((url) => {
  try {
    return new URL(url).pathname.length > 1;
  } catch {
    return false;
  }
});

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      ...(site.legalName ? { legalName: site.legalName } : {}),
      url: site.url,
      logo: `${site.url}/icon-512.png`,
      ...(profiles.length > 0 ? { sameAs: profiles } : {}),
      ...(site.contact.email
        ? {
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: site.contact.email,
                availableLanguage: "pt-BR",
              },
            ],
          }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: site.lang,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${montserrat.variable} ${barlow.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <CartProvider shopify={isShopifyConfigured()}>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-white"
          >
            Pular para o conteúdo
          </a>
          <AnnouncementBar />
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
