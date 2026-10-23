import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/product-grid";
import { GridSkeleton } from "@/components/ui/skeletons";
import { SearchIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { searchProducts } from "@/lib/shop";

// Resultados de busca não devem ser indexados (conteúdo duplicado e infinito).
export const metadata: Metadata = pageMetadata({
  title: "Buscar produtos",
  description: "Busque roupas de academia por nome, categoria ou tipo de peça.",
  path: "/busca",
  noindex: true,
});

export default function SearchPage({ searchParams }: PageProps<"/busca">) {
  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-4xl font-extrabold uppercase leading-[1] tracking-[-0.04em] sm:text-6xl">Buscar</h1>
      <Suspense fallback={<GridSkeleton items={4} />}>
        <SearchView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchView({ searchParams }: Pick<PageProps<"/busca">, "searchParams">) {
  const { q } = await searchParams;
  const term = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 80) ?? "";
  const products = term ? await searchProducts(term) : [];

  return (
    <>
      <form action="/busca" role="search" className="mb-10 mt-8 flex max-w-xl items-center rounded-full border border-ink pl-5 pr-1.5">
        <label htmlFor="busca-q" className="sr-only">
          O que você procura?
        </label>
        <input
          id="busca-q"
          name="q"
          type="search"
          defaultValue={term}
          placeholder="Legging, regata, moletom…"
          autoComplete="off"
          autoFocus={!term}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:shadow-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="grid size-10 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-volt hover:text-ink"
        >
          <SearchIcon className="size-5" />
        </button>
      </form>

      {term ? (
        <>
          <p className="mb-6 text-sm text-ink-soft">
            {products.length === 0
              ? `Nenhum resultado para “${term}”. Tente outra palavra, como “legging” ou “regata”.`
              : `Resultados para “${term}”`}
          </p>
          {products.length > 0 && <ProductGrid products={products} />}
        </>
      ) : (
        <p className="text-sm text-ink-soft">Digite o que você procura para ver os produtos.</p>
      )}
    </>
  );
}
