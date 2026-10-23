import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { FlagshipDetails } from "@/components/shop/flagship-details";
import { ProductBenefits, ProductDetails, ProductHeader } from "@/components/shop/product-details";
import { ProductCard } from "@/components/shop/product-card";
import { ProductExperience } from "@/components/shop/product-experience";
import { RecentlyViewed } from "@/components/shop/recently-viewed";
import { Rail } from "@/components/ui/rail";
import { railItem } from "@/components/ui/rail-item";
import { SectionHeading } from "@/components/ui/section-heading";
import { merch } from "@/config/merch";
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

  const related = (await getRecommendations(product.handle, product.id)).slice(0, 8);
  const category = product.collections[0];
  // Carro-chefe (o dos anúncios): kits com desconto, destaques e perguntas próprias.
  const flagship = product.handle === merch.flagship.product;

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
          bundles={flagship ? merch.flagship.bundles : undefined}
        />
      </div>

      {flagship && <FlagshipDetails />}

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16 sm:mt-24">
          <SectionHeading id="relacionados" eyebrow="Complete o look" title="Você também vai gostar" />
          <Rail label="Você também vai gostar">
            {related.map((item) => (
              <li key={item.id} className={railItem}>
                <ProductCard product={item} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 31vw, 44vw" />
              </li>
            ))}
          </Rail>
        </section>
      )}

      <RecentlyViewed
        current={{ handle: product.handle, title: product.title, price: product.price, image: product.featuredImage }}
      />

      <JsonLd data={productJsonLd(product)} />
    </article>
  );
}
