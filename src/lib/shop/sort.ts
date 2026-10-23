import type { ProductSort, ProductSummary } from "./types";

export const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "default", label: "Destaques" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "title", label: "Nome (A–Z)" },
];

/** Ordena sem mutar. "default" mantém a ordem original (a da coleção na Shopify). */
export function sortProducts<T extends ProductSummary>(products: T[], sort: ProductSort): T[] {
  const list = [...products];
  const price = (product: T) => Number(product.price.amount);
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return list.sort((a, b) => price(b) - price(a));
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    default:
      return list;
  }
}
