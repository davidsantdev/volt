import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProducts, getSpecialLinks } from "@/lib/shop";

/**
 * Bento de 3 peças: uma grande e duas empilhadas, como no layout de referência.
 * Só se chama "Mais vendidos" se o lojista criou essa coleção; loja nova mostra "Destaques".
 */
export async function TopSelling() {
  const [products, { bestHref }] = await Promise.all([getFeaturedProducts("best", 3), getSpecialLinks()]);
  if (products.length === 0) return null;
  const [main, topRight, bottomRight] = products;
  // O card verde combina com a ilustração do modo demo; fotos de fornecedor (fundo cinza/bege) ficam sujas sobre ele.
  const accentTone = topRight?.featuredImage ? "mist" : "volt";

  return (
    <section aria-labelledby="destaques" className="container-page py-16 sm:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id="destaques" className="text-2xl font-extrabold uppercase tracking-[-0.03em] sm:text-3xl">
          {bestHref ? "Mais vendidos" : "Destaques"}
        </h2>
        <ButtonLink href={bestHref ?? "/produtos"} variant="outline" size="sm">
          Ver todos
        </ButtonLink>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
        <ProductCard
          product={main}
          tone="white"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="md:row-span-2"
          mediaClassName="aspect-[4/5] md:aspect-auto"
        />
        {topRight && (
          <ProductCard
            product={topRight}
            tone={accentTone}
            sizes="(min-width: 768px) 50vw, 100vw"
            mediaClassName="aspect-[4/3] md:aspect-[5/2]"
          />
        )}
        {bottomRight && (
          <ProductCard
            product={bottomRight}
            tone="white"
            sizes="(min-width: 768px) 50vw, 100vw"
            mediaClassName="aspect-[4/3] md:aspect-[5/2]"
          />
        )}
      </div>
    </section>
  );
}
