import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
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
  const [collection, collections] = await Promise.all([getCollection(handle), getCollections()]);
  if (!collection) notFound();

  const others = collections.filter(
    (item) => item.handle !== collection.handle && !site.collections.hidden.includes(item.handle),
  );

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Coleções", href: "/colecoes" },
          { name: collection.title, href: `/colecoes/${collection.handle}` },
        ]}
      />
      <header className="mb-10 mt-6 max-w-2xl">
        <h1 className="text-4xl font-extrabold uppercase leading-[1] tracking-[-0.04em] sm:text-6xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{collection.description}</p>
        )}
      </header>

      <ProductGrid
        products={collection.products}
        emptyMessage="Ainda não há produtos nesta coleção. Volte em breve!"
      />

      {others.length > 0 && (
        <nav aria-label="Outras categorias" className="mt-20">
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Veja também</h2>
          <ul className="flex flex-wrap gap-2.5">
            {others.map((item) => (
              <li key={item.handle}>
                <Link
                  href={`/colecoes/${item.handle}`}
                  className="inline-flex h-11 items-center rounded-full border border-line px-5 text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <JsonLd data={collectionJsonLd(collection, collection.products)} />
    </div>
  );
}
