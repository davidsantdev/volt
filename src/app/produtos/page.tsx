import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
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
      <header className="mb-10 mt-6 max-w-2xl">
        <h1 className="text-4xl font-extrabold uppercase leading-[1] tracking-[-0.04em] sm:text-6xl">
          Todos os produtos
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Tops, shorts, conjuntos, moletons, jaquetas e acessórios, femininos e masculinos, escolhidos para treinar com
          conforto e liberdade de movimento.
        </p>
      </header>
      <ProductGrid products={products} />
      <JsonLd data={productListJsonLd("Todos os produtos", "/produtos", products)} />
    </div>
  );
}
