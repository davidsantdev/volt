import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Collection, Product, ProductSummary } from "@/lib/shop/types";
import { absoluteUrl, truncate } from "@/lib/utils";

type SeoImage = { url: string; width?: number; height?: number; alt?: string };

const defaultImage: SeoImage = { url: site.ogImage, width: 1200, height: 630, alt: site.name };

/** Metadados completos de uma página: canonical, Open Graph e Twitter com imagem. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: SeoImage | null;
  noindex?: boolean;
}): Metadata {
  const images = [image ?? defaultImage];
  // Se o título já traz a marca, não deixa o template acrescentar "| Fitnex" de novo.
  const hasBrand = title.toLowerCase().includes(site.name.toLowerCase());
  return {
    title: hasBrand ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url: path,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((item) => item.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/produtos/${product.handle}`);
  const images = product.images.map((image) => image.url);
  const inStock = product.variants.some((variant) => variant.availableForSale);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: product.title,
    description: truncate(product.description || product.title, 500),
    sku: product.variants[0]?.sku ?? undefined,
    // Sempre a sua marca: o "vendor" da Shopify costuma ser o nome do fornecedor.
    brand: { "@type": "Brand", name: site.name },
    category: product.collections[0]?.title,
    image: images.length > 0 ? images : [absoluteUrl("/icon-512.png")],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.price.currencyCode,
      lowPrice: product.price.amount,
      highPrice: product.maxPrice.amount,
      offerCount: product.variants.length,
      availability: `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`,
      // Direito de arrependimento (CDC, art. 49): 7 dias, devolução pelo correio e reembolso integral.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
      },
      offers: product.variants.slice(0, 50).map((variant) => ({
        "@type": "Offer",
        url,
        sku: variant.sku ?? undefined,
        name: variant.title === "Default Title" ? undefined : variant.title,
        priceCurrency: variant.price.currencyCode,
        price: variant.price.amount,
        itemCondition: "https://schema.org/NewCondition",
        availability: `https://schema.org/${variant.availableForSale ? "InStock" : "OutOfStock"}`,
      })),
    },
  };
}

export function collectionJsonLd(collection: Collection, products: ProductSummary[]) {
  const url = absoluteUrl(`/colecoes/${collection.handle}`);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: collection.title,
    description: collection.description || undefined,
    inLanguage: site.lang,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/produtos/${product.handle}`),
        name: product.title,
      })),
    },
  };
}

export function productListJsonLd(name: string, path: string, products: ProductSummary[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/produtos/${product.handle}`),
      name: product.title,
    })),
  };
}
