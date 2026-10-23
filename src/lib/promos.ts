import { site } from "@/config/site";
import type { Money } from "@/lib/shop/types";
import { formatMoney, moneyFrom } from "@/lib/utils";

/**
 * Promessas comerciais derivadas de src/config/site.ts. Cada uma só aparece quando está ligada lá,
 * para o site nunca anunciar algo que a Shopify ou o gateway não cumprem.
 */

/** "R$ 299" (sem centavos quando redondo). */
export function formatAmount(amount: number) {
  return formatMoney(moneyFrom(amount, site.currency)).replace(",00", "");
}

export function freeShippingLabel() {
  return site.freeShippingThreshold > 0 ? `Frete grátis acima de ${formatAmount(site.freeShippingThreshold)}` : null;
}

export function pixLabel() {
  return site.pixDiscount > 0 ? `${Math.round(site.pixDiscount * 100)}% off no Pix` : null;
}

/** "Leve 2 e ganhe 10% off", quando o desconto automático por quantidade está ligado. */
export function quantityDiscountLabel() {
  const { minItems, percent } = site.quantityDiscount;
  return minItems > 1 && percent > 0 ? `Leve ${minItems} e ganhe ${Math.round(percent * 100)}% off` : null;
}

export function installmentsLabel() {
  return site.maxInstallments > 1 ? `Até ${site.maxInstallments}x sem juros` : null;
}

/** "ou 3x de R$ 53,30 sem juros" para um preço, quando o parcelamento está ligado. */
export function installmentsFor(price: Money) {
  if (site.maxInstallments <= 1 || price.currencyCode !== site.currency) return null;
  const each = Math.floor((Number(price.amount) / site.maxInstallments) * 100) / 100;
  return `ou ${site.maxInstallments}x de ${formatMoney(moneyFrom(each, price.currencyCode))} sem juros`;
}

/** Mensagens da barra do topo: promoções ativas primeiro, depois as fixas. */
export function announcementMessages() {
  return [freeShippingLabel(), quantityDiscountLabel(), pixLabel(), installmentsLabel(), ...site.announcement].filter(
    (message): message is string => Boolean(message),
  );
}

/** Link do WhatsApp com mensagem pronta, ou null se o número não foi configurado. */
export function whatsappHref(text?: string) {
  const number = site.contact.whatsapp.replace(/\D/g, "");
  if (number.length < 10) return null;
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function hasContactChannel() {
  return Boolean(site.contact.email || whatsappHref());
}
