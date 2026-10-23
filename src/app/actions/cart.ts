"use server";

import { cookies, headers } from "next/headers";
import { isShopifyConfigured } from "@/lib/shop/config";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from "@/lib/shop/shopify";
import type { Cart } from "@/lib/shop/types";

const COOKIE = "cart_id";
/** A Shopify descarta carrinhos sem uso depois de ~10 dias. */
const MAX_AGE = 60 * 60 * 24 * 10;

export type CartResult = { ok: true; cart: Cart | null } | { ok: false; error: string };

const NOT_CONFIGURED: CartResult = { ok: false, error: "Loja ainda não conectada à Shopify." };

async function buyerIp() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    undefined
  );
}

async function readCartId() {
  return (await cookies()).get(COOKIE)?.value;
}

async function writeCartId(id: string) {
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

function fail(error: unknown, message: string): CartResult {
  console.error("[cart]", error);
  return { ok: false, error: message };
}

export async function getCartAction(): Promise<CartResult> {
  if (!isShopifyConfigured()) return { ok: true, cart: null };

  const id = await readCartId();
  if (!id) return { ok: true, cart: null };

  try {
    const cart = await cartGet(id, await buyerIp());
    if (!cart) (await cookies()).delete(COOKIE);
    return { ok: true, cart };
  } catch (error) {
    return fail(error, "Não foi possível carregar o carrinho.");
  }
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<CartResult> {
  if (!isShopifyConfigured()) return NOT_CONFIGURED;
  if (typeof variantId !== "string" || !variantId.startsWith("gid://shopify/ProductVariant/")) {
    return { ok: false, error: "Produto inválido." };
  }
  const qty = Math.min(Math.max(Math.trunc(Number(quantity)) || 1, 1), 20);
  const ip = await buyerIp();
  const id = await readCartId();
  const message = "Não foi possível adicionar este item. Ele pode estar sem estoque.";

  try {
    if (id) {
      try {
        return { ok: true, cart: await cartLinesAdd(id, variantId, qty, ip) };
      } catch (error) {
        // Só recria o carrinho se ele realmente expirou; outros erros (estoque) sobem.
        if (await cartGet(id, ip)) throw error;
      }
    }
    const cart = await cartCreate(variantId, qty, ip);
    await writeCartId(cart.id);
    return { ok: true, cart };
  } catch (error) {
    return fail(error, message);
  }
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartResult> {
  if (!isShopifyConfigured()) return NOT_CONFIGURED;
  const id = await readCartId();
  if (!id || typeof lineId !== "string" || !lineId.startsWith("gid://shopify/CartLine/")) {
    return { ok: false, error: "Item inválido." };
  }
  const qty = Math.min(Math.trunc(Number(quantity)) || 0, 99);

  try {
    const ip = await buyerIp();
    const cart =
      qty <= 0
        ? await cartLinesRemove(id, lineId, ip)
        : await cartLinesUpdate(id, lineId, qty, ip);
    return { ok: true, cart };
  } catch (error) {
    return fail(error, "Não foi possível atualizar a quantidade.");
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartResult> {
  return updateCartLineAction(lineId, 0);
}
