import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductBenefits, ProductDetails, ProductHeader } from "@/components/shop/product-details";
import { ProductCard } from "@/components/shop/product-card";
import { ProductExperience } from "@/components/shop/product-experience";
import { site } from "@/config/site";
import { pageMetadata, productJsonLd } from "@/lib/seo";
import { getProduct, getProductHandles, getRecommendations } from "@/lib/shop";
import { truncate } from "@/lib/utils";

/**
 * Exige a rota 100% estática: um produto fora do generateStaticParams (ex.: recém-importado
 * do fornecedor) espera a geração no primeiro acesso e fica em cache; um produto que não
 * existe responde 404 de verdade, e não 200 + noindex.
 */
export const ensureStatic = "navigation";
// `params` é lido sem <Suspense> de propósito (é o que permite o 404 real): desliga só o
// aviso de "navegação instantânea" do modo dev, que reclamaria disso.
export const instant = false;

/** Pré-gera os produtos mais vendidos; os demais nascem no primeiro acesso (ISR). */
export async function generateStaticParams() {
  const handles = await getProductHandles(100);
  // O Cache Components exige ao menos um parâmetro para validar a rota.
  return (handles.length > 0 ? handles : ["_"]).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Produto não encontrado", robots: { index: false, follow: false } };

  const image = product.images[0] ?? product.featuredImage;
  return {
    ...pageMetadata({
      title: product.seo.title || product.title,
      description: truncate(
        product.seo.description ||
          product.description ||
          `${product.title} na ${site.name}: roupas de academia com conforto e estilo.`,
        158,
      ),
      path: `/produtos/${product.handle}`,
      image: image
        ? { url: image.url, width: image.width, height: image.height, alt: image.altText || product.title }
        : null,
    }),
    other: {
      "product:price:amount": product.price.amount,
      "product:price:currency": product.price.currencyCode,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/produtos/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getRecommendations(product.handle, product.id)).slice(0, 4);
  const category = product.collections[0];

  return (
    <article className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Loja", href: "/produtos" },
          ...(category ? [{ name: category.title, href: `/colecoes/${category.handle}` }] : []),
          { name: product.title, href: `/produtos/${product.handle}` },
        ]}
      />

      <div className="mt-6">
        <ProductExperience
          product={product}
          header={<ProductHeader product={product} />}
          benefits={<ProductBenefits />}
          details={<ProductDetails product={product} />}
        />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-20 sm:mt-28">
          <h2 id="relacionados" className="mb-8 text-2xl font-extrabold uppercase tracking-[-0.03em] sm:text-3xl">
            Você também vai gostar
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id} className="flex">
                <ProductCard product={item} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
    </article>
  );
}
