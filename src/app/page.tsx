import type { Metadata } from "next";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Deals } from "@/components/home/deals";
import { Editorial } from "@/components/home/editorial";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { SeoText } from "@/components/home/seo-text";
import { SetupNotice } from "@/components/home/setup-notice";
import { TopSelling } from "@/components/home/top-selling";
import { TrustStrip } from "@/components/home/trust-strip";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Ordem das lojas que vendem: foto forte no topo, produtos logo em seguida, categorias, uma faixa editorial. */
export default function HomePage() {
  return (
    <>
      <SetupNotice />
      <Hero />
      <TrustStrip />
      <Deals />
      <TopSelling />
      <CategoryTiles />
      <Editorial />
      <NewArrivals />
      <Faq />
      <SeoText />
    </>
  );
}
