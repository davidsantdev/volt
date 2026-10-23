import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CategoryChips } from "@/components/shop/category-chips";
import { ProductGrid } from "@/components/shop/product-grid";
import { site } from "@/config/site";
import { collectionJsonLd, pageMetadata } from "@/lib/seo";
import { getCollection, getCollections } from "@/lib/shop";
import { truncate } from "@/lib/utils";

/** Rota 100% estática; coleção inexistente responde 404 de verdade (veja produtos/[handle]). */
export const ensureStatic = "navigation";
export const instant = false; // veja o comentário em produtos/[handle]/page.tsx

export async function generateStaticParams() {
  const handles = (await getCollections()).map((collection) => collection.handle);
  return (handles.length > 0 ? handles : ["_"]).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<"/colecoes/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Coleção não encontrada", robots: { index: false, follow: false } };

  const image = collection.image;
  return pageMetadata({
    title: collection.seo.title || `${collection.title}: roupas de academia`,
    description: truncate(
      collection.seo.description ||
        collection.description ||
        `${collection.title} na ${site.name}: roupas de academia com conforto, estilo e liberdade de movimento.`,
      158,
    ),
    path: `/colecoes/${collection.handle}`,
    image: image
      ? { url: image.url, width: image.width, height: image.height, alt: image.altText || collection.title }
      : null,
  });
}

export default async function CollectionPage({ params }: PageProps<"/colecoes/[handle]">) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Coleções", href: "/colecoes" },
          { name: collection.title, href: `/colecoes/${collection.handle}` },
        ]}
      />
      <header className="mb-6 mt-5 max-w-2xl">
        <h1 className="font-display text-[2.75rem] font-extrabold uppercase leading-[0.92] sm:text-6xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{collection.description}</p>
        )}
      </header>
      <CategoryChips current={collection.handle} />

      <ProductGrid
        products={collection.products}
        emptyMessage="Ainda não há produtos nesta coleção. Volte em breve!"
      />

      <JsonLd data={collectionJsonLd(collection, collection.products)} />
    </div>
  );
}
