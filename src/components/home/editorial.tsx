import { ShopPhoto } from "@/components/shop/shop-photo";
import { ButtonLink } from "@/components/ui/button";
import { merch } from "@/config/merch";
import { getCollections, getPhotos } from "@/lib/shop";

/** Faixa com duas fotos e um convite para uma coleção (src/config/merch.ts → editorial). */
export async function Editorial() {
  const { editorial } = merch;
  const [collections, photos] = await Promise.all([getCollections(), getPhotos(editorial.photos)]);
  if (!collections.some((collection) => collection.handle === editorial.collection) || photos.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="editorial-title" className="container-page pb-10 sm:pb-16">
      <div className="grid overflow-hidden rounded-card bg-ink text-white md:min-h-[34rem] md:grid-cols-[1fr_1fr_1.15fr]">
        {photos.slice(0, 2).map((photo, index) => (
          <div
            key={`${photo.href}-${index}`}
            className={index === 0 ? "relative aspect-[4/5] md:aspect-auto" : "relative hidden md:block"}
          >
            <ShopPhoto photo={photo} tone={index + 1} sizes="(min-width: 768px) 32vw, 100vw" />
          </div>
        ))}
        <div className="flex flex-col justify-center gap-5 p-7 sm:p-10 lg:p-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-volt">{editorial.eyebrow}</p>
          <h2
            id="editorial-title"
            className="font-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold uppercase leading-[0.92]"
          >
            {editorial.title}
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-white/80">{editorial.text}</p>
          <ButtonLink
            href={`/colecoes/${editorial.collection}`}
            variant="white"
            size="lg"
            className="mt-2 self-start"
          >
            {editorial.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
