"use server";

import { cookies, headers } from "next/headers";
import { isShopifyConfigured } from "@/lib/shop/config";
import {
  cartCreate,
  cartDiscountCodesUpdate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  cartShippingQuote,
} from "@/lib/shop/shopify";
import type { Cart, ShippingQuote } from "@/lib/shop/types";

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

/** Aplica um cupom (texto vazio remove). A Shopify diz se ele vale para estes itens em `discountCodes`. */
export async function updateDiscountAction(code: string): Promise<CartResult> {
  if (!isShopifyConfigured()) return { ok: false, error: "Cupons funcionam com a loja conectada à Shopify." };
  const id = await readCartId();
  if (!id) return { ok: false, error: "Seu carrinho está vazio." };
  const clean = String(code ?? "").trim().slice(0, 50);
  try {
    return { ok: true, cart: await cartDiscountCodesUpdate(id, clean ? [clean] : [], await buyerIp()) };
  } catch (error) {
    return fail(error, "Não foi possível aplicar o cupom agora.");
  }
}

export type ShippingResult =
  | { ok: true; place: string | null; options: ShippingQuote[] }
  | { ok: false; error: string };

/** Cidade e UF do CEP (ViaCEP, serviço público). null se o serviço não responder; "invalid" se o CEP não existe. */
async function lookupCep(cep: string): Promise<{ city: string; uf: string } | null | "invalid"> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;
    const data = (await response.json()) as { erro?: boolean | string; localidade?: string; uf?: string };
    if (data.erro) return "invalid";
    return data.localidade && data.uf ? { city: data.localidade, uf: data.uf } : null;
  } catch {
    return null;
  }
}

/** Calcula o frete do carrinho atual para um CEP (taxas reais da Shopify). */
export async function estimateShippingAction(cepInput: string): Promise<ShippingResult> {
  if (!isShopifyConfigured()) return { ok: false, error: "O frete é calculado com a loja conectada à Shopify." };
  const cep = String(cepInput ?? "").replace(/\D/g, "");
  if (cep.length !== 8) return { ok: false, error: "Digite um CEP com 8 números." };
  const id = await readCartId();
  if (!id) return { ok: false, error: "Adicione um produto para calcular o frete." };

  const place = await lookupCep(cep);
  if (place === "invalid") return { ok: false, error: "CEP não encontrado. Confira os números." };
  try {
    const options = await cartShippingQuote(
      id,
      { zip: `${cep.slice(0, 5)}-${cep.slice(5)}`, city: place?.city, provinceCode: place?.uf },
      await buyerIp(),
    );
    if (options.length === 0) {
      return { ok: false, error: "Ainda não há opção de entrega para este CEP." };
    }
    return { ok: true, place: place ? `${place.city}/${place.uf}` : null, options };
  } catch (error) {
    console.error("[frete]", error);
    return { ok: false, error: "Não foi possível calcular o frete agora. Ele aparece no checkout." };
  }
}
