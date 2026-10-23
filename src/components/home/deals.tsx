import { ProductCard } from "@/components/shop/product-card";
import { Rail } from "@/components/ui/rail";
import { railItem } from "@/components/ui/rail-item";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDeals } from "@/lib/shop";
import { formatMoney } from "@/lib/utils";

/** Vitrines de preço baixo (leggings, regatas…) logo abaixo do topo. Configuração em src/config/merch.ts → deals. */
export async function Deals() {
  const deals = await getDeals();

  return deals.map((deal, dealIndex) => {
    const id = `vitrine-${dealIndex}`;
    return (
      <section key={deal.title} aria-labelledby={id} className="container-page pt-10 sm:pt-16">
        <SectionHeading
          id={id}
          eyebrow={`A partir de ${formatMoney(deal.from)}`}
          title={deal.title}
          href={deal.href}
          linkLabel="Ver todas"
        />
        <Rail label={deal.title}>
          {deal.products.map((product, index) => (
            <li key={product.id} className={railItem}>
              <ProductCard
                product={product}
                priority={dealIndex === 0 && index < 2}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 44vw"
              />
            </li>
          ))}
        </Rail>
      </section>
    );
  });
}
