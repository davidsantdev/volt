import { ProductCard } from "@/components/shop/product-card";
import { Rail } from "@/components/ui/rail";
import { railItem } from "@/components/ui/rail-item";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProducts, getSpecialLinks } from "@/lib/shop";

export async function NewArrivals() {
  const [fresh, featured, { newHref }] = await Promise.all([
    getFeaturedProducts("new", 16),
    getFeaturedProducts("best", 8),
    getSpecialLinks(),
  ]);
  // Não repete o que o carrossel de destaques já mostrou; catálogo pequeno demais, a seção some.
  const shown = new Set(featured.map((product) => product.id));
  const products = fresh.filter((product) => !shown.has(product.id)).slice(0, 8);
  if (products.length < 2) return null;

  return (
    <section aria-labelledby="lancamentos" className="container-page pb-10 sm:pb-16">
      <SectionHeading id="lancamentos" eyebrow="Novidades" title="Acabou de chegar" href={newHref} linkLabel="Ver tudo" />
      <Rail label="Acabou de chegar">
        {products.map((product) => (
          <li key={product.id} className={railItem}>
            <ProductCard product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 44vw" />
          </li>
        ))}
      </Rail>
    </section>
  );
}
