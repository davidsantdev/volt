export type ShopifyConfig = {
  domain: string;
  apiVersion: string;
  country: string;
  language: string | null;
  privateToken: string | null;
  publicToken: string | null;
};

/** Retorna `null` quando a Shopify não está configurada (modo demonstração). */
export function getShopifyConfig(): ShopifyConfig | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim() || null;
  const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN?.trim() || null;

  if (!domain || (!privateToken && !publicToken)) return null;

  return {
    domain,
    privateToken,
    publicToken,
    apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || "2026-10",
    country: process.env.SHOPIFY_COUNTRY?.trim() || "BR",
    language: process.env.SHOPIFY_LANGUAGE?.trim() || null,
  };
}

export function isShopifyConfigured() {
  return getShopifyConfig() !== null;
}
