import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProducts, getSpecialLinks } from "@/lib/shop";

export async function NewArrivals() {
  const [fresh, featured, { newHref }] = await Promise.all([
    getFeaturedProducts("new", 8),
    getFeaturedProducts("best", 3),
    getSpecialLinks(),
  ]);
  // Não repete o que o bloco de destaques já mostrou; catálogo pequeno demais, a seção some.
  const shown = new Set(featured.map((product) => product.id));
  const products = fresh.filter((product) => !shown.has(product.id)).slice(0, 4);
  if (products.length < 2) return null;

  return (
    <section aria-labelledby="lancamentos" className="container-page pb-16 sm:pb-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id="lancamentos" className="text-2xl font-extrabold uppercase tracking-[-0.03em] sm:text-3xl">
          Acabou de chegar
        </h2>
        <ButtonLink href={newHref} variant="outline" size="sm">
          Ver tudo
        </ButtonLink>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
