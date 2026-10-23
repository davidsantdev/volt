import { ShopPhoto } from "@/components/shop/shop-photo";
import { ButtonLink } from "@/components/ui/button";
import { merch } from "@/config/merch";
import { getCollections, getPhotos } from "@/lib/shop";
import { cn } from "@/lib/utils";

/**
 * Topo editorial com fotos de modelo (como Gymshark e Oner Active): três fotos lado a lado no desktop e uma no
 * celular, com o título e os botões por cima. As fotos vêm de src/config/merch.ts.
 */
export async function Hero() {
  const [photos, collections] = await Promise.all([getPhotos(merch.hero), getCollections()]);
  const handles = new Set(collections.map((collection) => collection.handle));
  // `short` cabe lado a lado no celular.
  const ctas = [
    handles.has("feminino") && { href: "/colecoes/feminino", label: "Comprar feminino", short: "Feminino" },
    handles.has("masculino") && { href: "/colecoes/masculino", label: "Comprar masculino", short: "Masculino" },
  ].filter((cta): cta is { href: string; label: string; short: string } => Boolean(cta));
  if (ctas.length === 0) ctas.push({ href: "/produtos", label: "Comprar agora", short: "Comprar agora" });

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ink text-white">
      <div className="grid h-[min(80svh,46rem)] min-h-[32rem] grid-cols-1 md:grid-cols-3">
        {photos.slice(0, 3).map((photo, index) => (
          <div key={`${photo.href}-${index}`} className={cn("relative", index > 0 && "hidden md:block")}>
            <ShopPhoto
              photo={photo}
              tone={index}
              priority={index === 0}
              sizes="(min-width: 768px) 34vw, 100vw"
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-black/45 via-transparent to-transparent md:block"
      />

      <div className="absolute inset-x-0 bottom-0">
        <div className="container-page pb-10 sm:pb-14">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em]">
            <span aria-hidden="true" className="h-0.5 w-6 bg-volt" />
            Feminino e masculino
          </p>
          <h1
            id="hero-title"
            className="mt-3 font-display text-[clamp(3.4rem,9vw,7.25rem)] font-extrabold uppercase leading-[0.86]"
          >
            Roupas de
            <br />
            academia
          </h1>
          <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-white/85 sm:text-base">
            Tops, shorts, conjuntos e moletons para treinar com estilo, do aquecimento ao último set.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {ctas.map((cta, index) => (
              <ButtonLink
                key={cta.href}
                href={cta.href}
                size="lg"
                variant={index === 0 ? "white" : "outline-light"}
                className="px-7 sm:px-9"
              >
                <span className="sm:hidden">{cta.short}</span>
                <span className="hidden sm:inline">{cta.label}</span>
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
