import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryTileLink } from "@/components/shop/category-tile";
import { ArrowRightIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { getCategoryTiles, getCollections } from "@/lib/shop";

export const metadata: Metadata = pageMetadata({
  title: "Coleções de roupas de academia",
  description:
    "Explore as coleções: feminino, masculino, leggings, shorts, regatas, tops, moletons e acessórios para treinar com conforto.",
  path: "/colecoes",
});

export default async function CollectionsPage() {
  const [tiles, collections] = await Promise.all([getCategoryTiles(), getCollections()]);
  // Lançamentos e Mais vendidos não são categorias, mas valem um atalho aqui.
  const special = collections.filter(
    (collection) =>
      site.collections.hidden.includes(collection.handle) && !["frontpage", "all"].includes(collection.handle),
  );

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Coleções", href: "/colecoes" },
        ]}
      />
      <header className="mb-8 mt-5 max-w-2xl">
        <h1 className="font-display text-[2.75rem] font-extrabold uppercase leading-[0.92] sm:text-6xl">Coleções</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Encontre a peça certa para o seu treino, do aquecimento ao alongamento.
        </p>
        {special.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {special.map((collection) => (
              <li key={collection.handle}>
                <Link
                  href={`/colecoes/${collection.handle}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-xs font-bold text-white transition-colors hover:bg-volt hover:text-ink"
                >
                  {collection.title} <ArrowRightIcon className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      {tiles.length === 0 ? (
        <p className="rounded-card bg-mist p-10 text-center text-sm text-ink-soft">Nenhuma coleção publicada ainda.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map((tile, index) => (
            <li key={tile.handle}>
              <CategoryTileLink
                tile={tile}
                index={index}
                size="lg"
                priority={index < 4}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
