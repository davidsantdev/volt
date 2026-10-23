import { site } from "@/config/site";
import type { Money } from "@/lib/shop/types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export function moneyFrom(amount: number, currencyCode: string): Money {
  return { amount: amount.toFixed(2), currencyCode };
}

export function isOnSale(price: Money, compareAt: Money | null) {
  return compareAt !== null && Number(compareAt.amount) > Number(price.amount);
}

export function discountPercent(price: Money, compareAt: Money | null) {
  if (!compareAt || !isOnSale(price, compareAt)) return 0;
  return Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100);
}

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** `gid://shopify/Product/123` -> `123` */
export function numericId(gid: string) {
  return gid.split("/").pop() ?? gid;
}

export function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}
