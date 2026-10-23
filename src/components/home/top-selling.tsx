import { ProductCard } from "@/components/shop/product-card";
import { Rail } from "@/components/ui/rail";
import { railItem } from "@/components/ui/rail-item";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProducts, getSpecialLinks } from "@/lib/shop";

/**
 * Carrossel de destaques logo abaixo do topo, como nas lojas grandes.
 * Só se chama "Mais vendidos" se o lojista criou essa coleção; loja nova mostra "Destaques".
 */
export async function TopSelling() {
  const [products, { bestHref }] = await Promise.all([getFeaturedProducts("best", 8), getSpecialLinks()]);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="destaques" className="container-page py-10 sm:py-16">
      <SectionHeading
        id="destaques"
        eyebrow={bestHref ? "Os favoritos" : "Escolhidos para você"}
        title={bestHref ? "Mais vendidos" : "Destaques"}
        href={bestHref ?? "/produtos"}
      />
      <Rail label={bestHref ? "Mais vendidos" : "Destaques"}>
        {products.map((product, index) => (
          <li key={product.id} className={railItem}>
            <ProductCard product={product} priority={index < 2} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 44vw" />
          </li>
        ))}
      </Rail>
    </section>
  );
}
