"use client";

import { useId, useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { CloseIcon } from "@/components/ui/icons";
import { colorInfo, colorLabel, isColorOption, isSizeOption, sizeLabel, sortOptionValues } from "@/lib/shop/labels";
import { sortOptions, sortProducts } from "@/lib/shop/sort";
import type { ProductSort, ProductSummary } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

type FacetKey = "type" | "size" | "color" | "price";
type Facet = { key: FacetKey; label: string; values: { value: string; hex?: string }[] };
type Selection = Record<FacetKey, string[]>;

const EMPTY: Selection = { type: [], size: [], color: [], price: [] };

const PRICE_BANDS = [
  { value: "Até R$ 50", min: 0, max: 50 },
  { value: "R$ 50 a R$ 100", min: 50, max: 100 },
  { value: "R$ 100 a R$ 150", min: 100, max: 150 },
  { value: "Acima de R$ 150", min: 150, max: Infinity },
];

/** Valores de cada filtro que um produto tem (cores e tamanhos já em português). */
function facetsOf(product: ProductSummary): Record<FacetKey, string[]> {
  const sizes: string[] = [];
  const colors: string[] = [];
  for (const option of product.options) {
    if (isColorOption(option)) colors.push(...option.values.map(colorLabel));
    else if (isSizeOption(option)) sizes.push(...option.values.map(sizeLabel));
  }
  const price = Number(product.price.amount);
  const band = PRICE_BANDS.find((item) => price >= item.min && price < item.max)?.value;
  return { type: product.productType ? [product.productType] : [], size: sizes, color: colors, price: band ? [band] : [] };
}

function buildFacets(products: ProductSummary[]): Facet[] {
  const types = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Map<string, string | undefined>();
  const prices = new Set<string>();
  for (const product of products) {
    const facets = facetsOf(product);
    facets.type.forEach((value) => types.add(value));
    facets.size.forEach((value) => sizes.add(value));
    facets.price.forEach((value) => prices.add(value));
    for (const option of product.options.filter(isColorOption)) {
      for (const value of option.values) colors.set(colorLabel(value), colorInfo(value)?.hex);
    }
  }
  const facets: Facet[] = [
    { key: "type", label: "Categoria", values: [...types].sort((a, b) => a.localeCompare(b, "pt-BR")).map((value) => ({ value })) },
    { key: "size", label: "Tamanho", values: sortOptionValues("Size", [...sizes]).map((value) => ({ value })) },
    { key: "color", label: "Cor", values: [...colors].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([value, hex]) => ({ value, hex })) },
    { key: "price", label: "Preço", values: PRICE_BANDS.filter((band) => prices.has(band.value)).map(({ value }) => ({ value })) },
  ];
  // Filtro com uma opção só não filtra nada.
  return facets.filter((facet) => facet.values.length > 1);
}

/** Grade com filtros e ordenação no navegador: a página continua 100% estática e indexável. */
export function ProductGrid({
  products,
  emptyMessage = "Nenhum produto por aqui ainda.",
}: {
  products: ProductSummary[];
  emptyMessage?: string;
}) {
  const [sort, setSort] = useState<ProductSort>("default");
  const [selection, setSelection] = useState<Selection>(EMPTY);
  const [open, setOpen] = useState(false);
  const selectId = useId();
  const panelId = useId();

  const facets = useMemo(() => buildFacets(products), [products]);
  const filtered = useMemo(() => {
    const active = (Object.keys(selection) as FacetKey[]).filter((key) => selection[key].length > 0);
    const list = active.length
      ? products.filter((product) => {
          const values = facetsOf(product);
          return active.every((key) => selection[key].some((value) => values[key].includes(value)));
        })
      : products;
    return sortProducts(list, sort);
  }, [products, selection, sort]);

  const activeChips = (Object.keys(selection) as FacetKey[]).flatMap((key) => selection[key].map((value) => ({ key, value })));

  function toggle(key: FacetKey, value: string) {
    setSelection((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  }

  if (products.length === 0) {
    return <p className="rounded-card bg-mist p-10 text-center text-sm text-ink-soft">{emptyMessage}</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {facets.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={panelId}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors",
                open || activeChips.length ? "border-ink bg-ink text-white" : "border-ink hover:bg-mist",
              )}
            >
              Filtrar{activeChips.length ? ` (${activeChips.length})` : ""}
            </button>
          )}
          <p className="truncate text-sm text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
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

      {open && (
        <div id={panelId} className="mb-5 grid gap-6 rounded-card bg-mist p-5 sm:grid-cols-2 lg:grid-cols-4">
          {facets.map((facet) => (
            <fieldset key={facet.key}>
              <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em]">{facet.label}</legend>
              <div className="flex flex-wrap gap-2">
                {facet.values.map(({ value, hex }) => {
                  const pressed = selection[facet.key].includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => toggle(facet.key, value)}
                      className={cn(
                        "flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition-colors",
                        pressed ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                      )}
                    >
                      {hex && <span aria-hidden="true" className="size-3 rounded-full border border-black/20" style={{ backgroundColor: hex }} />}
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeChips.map(({ key, value }) => (
            <button
              key={`${key}-${value}`}
              type="button"
              onClick={() => toggle(key, value)}
              className="flex h-8 items-center gap-1.5 rounded-full bg-lime px-3 text-xs font-bold"
              aria-label={`Remover filtro ${value}`}
            >
              {value}
              <CloseIcon className="size-3.5" />
            </button>
          ))}
          <button type="button" onClick={() => setSelection(EMPTY)} className="text-xs font-bold underline underline-offset-4">
            Limpar filtros
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-card bg-mist p-10 text-center text-sm text-ink-soft">
          Nenhum produto com esses filtros.{" "}
          <button type="button" onClick={() => setSelection(EMPTY)} className="font-bold text-ink underline underline-offset-4">
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <li key={product.id} className="flex">
              <ProductCard product={product} priority={index < 4} className="w-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
