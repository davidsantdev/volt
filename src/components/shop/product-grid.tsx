"use client";

import { useId, useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { sortOptions, sortProducts } from "@/lib/shop/sort";
import type { ProductSort, ProductSummary } from "@/lib/shop/types";

/** Grade com ordenação no navegador: a página continua 100% estática e indexável. */
export function ProductGrid({
  products,
  emptyMessage = "Nenhum produto por aqui ainda.",
}: {
  products: ProductSummary[];
  emptyMessage?: string;
}) {
  const [sort, setSort] = useState<ProductSort>("default");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  const selectId = useId();

  if (products.length === 0) {
    return <p className="rounded-card bg-mist p-10 text-center text-sm text-ink-soft">{emptyMessage}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor={selectId} className="sr-only text-[11px] font-bold uppercase tracking-[0.14em] min-[400px]:not-sr-only">
            Ordenar
          </label>
          <select
            id={selectId}
            value={sort}
            onChange={(event) => setSort(event.target.value as ProductSort)}
            className="h-10 min-w-0 rounded-full border border-line bg-white px-4 text-sm font-semibold"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {sorted.map((product, index) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} priority={index < 4} className="w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
