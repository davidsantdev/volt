import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CategoryChips } from "@/components/shop/category-chips";
import { ProductGrid } from "@/components/shop/product-grid";
import { pageMetadata, productListJsonLd } from "@/lib/seo";
import { getProducts } from "@/lib/shop";

export const metadata: Metadata = pageMetadata({
  title: "Roupas de academia: tops, shorts, conjuntos e mais",
  description:
    "Veja todas as roupas de academia: tops, shorts, conjuntos, moletons, jaquetas e acessórios, femininos e masculinos, para treinar com conforto.",
  path: "/produtos",
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Loja", href: "/produtos" },
        ]}
      />
      <header className="mb-6 mt-5 max-w-2xl">
        <h1 className="font-display text-[2.75rem] font-extrabold uppercase leading-[0.92] sm:text-6xl">
          Todos os produtos
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Tops, shorts, conjuntos, moletons, jaquetas e acessórios, femininos e masculinos, escolhidos para treinar com
          conforto e liberdade de movimento.
        </p>
      </header>
      <CategoryChips current={null} />
      <ProductGrid products={products} />
      <JsonLd data={productListJsonLd("Todos os produtos", "/produtos", products)} />
    </div>
  );
}
