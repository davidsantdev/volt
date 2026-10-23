import type { Metadata } from "next";
import { Campaign } from "@/components/home/campaign";
import { Categories } from "@/components/home/categories";
import { Craft } from "@/components/home/craft";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { NewArrivals } from "@/components/home/new-arrivals";
import { SetupNotice } from "@/components/home/setup-notice";
import { TopSelling } from "@/components/home/top-selling";
import { TrustStrip } from "@/components/home/trust-strip";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <SetupNotice />
      <Hero />
      <TrustStrip />
      <TopSelling />
      <Craft />
      <Marquee />
      <Campaign />
      <NewArrivals />
      <Categories />
      <Faq />
    </>
  );
}
