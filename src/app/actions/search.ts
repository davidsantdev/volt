"use server";

import { suggestProducts } from "@/lib/shop";
import type { Money, ShopImage } from "@/lib/shop/types";

export type Suggestion = { handle: string; title: string; price: Money; image: ShopImage | null };

/** Sugestões da busca instantânea: só o necessário para a lista (título, preço e foto). */
export async function suggestAction(term: string): Promise<Suggestion[]> {
  const query = String(term ?? "").trim().slice(0, 60);
  if (query.length < 2) return [];
  try {
    return (await suggestProducts(query)).map((product) => ({
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.featuredImage,
    }));
  } catch (error) {
    console.error("[busca]", error);
    return [];
  }
}
