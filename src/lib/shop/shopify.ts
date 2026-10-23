import "server-only";
import sanitizeHtml from "sanitize-html";
import { site } from "@/config/site";
import { getShopifyConfig } from "./config";
import { sortOptionValues } from "./labels";
import type {
  Cart,
  CartLine,
  Collection,
  CollectionWithProducts,
  PageContent,
  Product,
  ProductSort,
  ProductSummary,
  ShopImage,
  Variant,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Cliente GraphQL                                                            */
/* -------------------------------------------------------------------------- */

export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyError";
  }
}

type FetchOptions = {
  /** Injeta `$country`/`$language` (leituras que usam @inContext). */
  context?: boolean;
  /** IP do comprador, recomendado pela Shopify em chamadas disparadas por ele. */
  buyerIp?: string;
};

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { context = false, buyerIp }: FetchOptions = {},
): Promise<T> {
  const config = getShopifyConfig();
  if (!config) {
    throw new ShopifyError(
      "Shopify não configurada. Defina SHOPIFY_STORE_DOMAIN e um token da Storefront API.",
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (config.privateToken) headers["Shopify-Storefront-Private-Token"] = config.privateToken;
  else if (config.publicToken) headers["X-Shopify-Storefront-Access-Token"] = config.publicToken;
  if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;

  const response = await fetch(
    `https://${config.domain}/api/${config.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: context
          ? { country: config.country, language: config.language, ...variables }
          : variables,
      }),
    },
  );

  if (!response.ok) {
    throw new ShopifyError(`A Shopify respondeu HTTP ${response.status}.`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((error) => error.message).join("; "));
  }
  if (!json.data) throw new ShopifyError("Resposta vazia da Shopify.");
  return json.data;
}

/* -------------------------------------------------------------------------- */
/* Fragmentos                                                                 */
/* -------------------------------------------------------------------------- */

const IMAGE = /* GraphQL */ `
  fragment ImageFields on Image { url altText width height }
`;
const MONEY = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 { amount currencyCode }
`;
const VARIANT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    availableForSale
    selectedOptions { name value }
    price { ...MoneyFields }
    compareAtPrice { ...MoneyFields }
    image { ...ImageFields }
  }
`;
const PRODUCT_BASE = /* GraphQL */ `
  fragment ProductBase on Product {
    id
    handle
    title
    vendor
    productType
    availableForSale
    createdAt
    featuredImage { ...ImageFields }
    priceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
    compareAtPriceRange { minVariantPrice { ...MoneyFields } }
    options { name optionValues { name } }
  }
`;
const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCardFields on Product {
    ...ProductBase
    variants(first: 30) { nodes { ...VariantFields } }
  }
`;
const PRODUCT_FULL = /* GraphQL */ `
  fragment ProductFullFields on Product {
    ...ProductBase
    description
    descriptionHtml
    updatedAt
    seo { title description }
    images(first: 20) { nodes { ...ImageFields } }
    collections(first: 5) { nodes { handle title } }
    variants(first: 100) { nodes { ...VariantFields } }
  }
`;

const CARD_FRAGMENTS = [IMAGE, MONEY, VARIANT, PRODUCT_BASE, PRODUCT_CARD].join("\n");
const FULL_FRAGMENTS = [IMAGE, MONEY, VARIANT, PRODUCT_BASE, PRODUCT_FULL].join("\n");

const CART_FRAGMENT = /* GraphQL */ `
  ${IMAGE}
  ${MONEY}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...MoneyFields }
      totalAmount { ...MoneyFields }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount { ...MoneyFields }
          amountPerQuantity { ...MoneyFields }
          compareAtAmountPerQuantity { ...MoneyFields }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            image { ...ImageFields }
            product { handle title featuredImage { ...ImageFields } }
          }
        }
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/* Mapeamento                                                                 */
/* -------------------------------------------------------------------------- */

type GqlImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};
type GqlMoney = { amount: string; currencyCode: string };
type GqlVariant = {
  id: string;
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: GqlMoney;
  compareAtPrice?: GqlMoney | null;
  image?: GqlImage | null;
};
type GqlProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  availableForSale: boolean;
  createdAt: string;
  featuredImage?: GqlImage | null;
  priceRange: { minVariantPrice: GqlMoney; maxVariantPrice: GqlMoney };
  compareAtPriceRange: { minVariantPrice: GqlMoney };
  options: { name: string; optionValues: { name: string }[] }[];
  variants: { nodes: GqlVariant[] };
  description?: string;
  descriptionHtml?: string;
  updatedAt?: string;
  seo?: { title?: string | null; description?: string | null };
  images?: { nodes: GqlImage[] };
  collections?: { nodes: { handle: string; title: string }[] };
};

function mapImage(image?: GqlImage | null): ShopImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText ?? null,
    width: image.width ?? 1000,
    height: image.height ?? 1000,
  };
}

function mapVariant(variant: GqlVariant): Variant {
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku ?? null,
    availableForSale: variant.availableForSale,
    selectedOptions: variant.selectedOptions,
    price: variant.price,
    compareAtPrice:
      variant.compareAtPrice && Number(variant.compareAtPrice.amount) > 0
        ? variant.compareAtPrice
        : null,
    image: mapImage(variant.image),
  };
}

function mapProductSummary(node: GqlProduct): ProductSummary {
  const price = node.priceRange.minVariantPrice;
  const compareAt = node.compareAtPriceRange.minVariantPrice;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    vendor: node.vendor,
    productType: node.productType,
    // Não pedimos `tags` à API: exigiria uma permissão extra no token e o site não as usa.
    tags: [],
    availableForSale: node.availableForSale,
    createdAt: node.createdAt,
    featuredImage: mapImage(node.featuredImage),
    price,
    maxPrice: node.priceRange.maxVariantPrice,
    compareAtPrice: Number(compareAt.amount) > Number(price.amount) ? compareAt : null,
    options: node.options
      .map((option) => ({
        name: option.name,
        values: sortOptionValues(option.name, option.optionValues.map((v) => v.name)),
      }))
      // A Shopify cria a opção "Title" quando o produto não tem variações reais.
      .filter((option) => !(option.name === "Title" && option.values.length === 1)),
    variants: node.variants.nodes.map(mapVariant),
  };
}

/** Descrições vindas de fornecedores podem trazer scripts/estilos: só passa o básico. */
function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "h2", "h3", "h4",
      "table", "thead", "tbody", "tr", "th", "td", "a", "span",
    ],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    },
  });
}

function mapProduct(node: GqlProduct): Product {
  const summary = mapProductSummary(node);
  const images = (node.images?.nodes ?? []).map((image) => mapImage(image)!).filter(Boolean);
  return {
    ...summary,
    description: node.description ?? "",
    descriptionHtml: cleanHtml(node.descriptionHtml ?? ""),
    updatedAt: node.updatedAt ?? node.createdAt,
    images: images.length ? images : summary.featuredImage ? [summary.featuredImage] : [],
    seo: { title: node.seo?.title ?? null, description: node.seo?.description ?? null },
    collections: node.collections?.nodes ?? [],
  };
}

/* -------------------------------------------------------------------------- */
/* Catálogo                                                                   */
/* -------------------------------------------------------------------------- */

const CONTEXT_VARS = "$country: CountryCode, $language: LanguageCode";
const IN_CONTEXT = "@inContext(country: $country, language: $language)";

const SORT_MAP: Record<ProductSort, { sortKey: string; reverse: boolean }> = {
  default: { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED_AT", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  title: { sortKey: "TITLE", reverse: false },
};

const MAX_PRODUCTS = 200;
const PAGE_SIZE = 50;

export async function listProducts(sort: ProductSort = "default", limit = MAX_PRODUCTS) {
  const { sortKey, reverse } = SORT_MAP[sort];
  const query = /* GraphQL */ `
    ${CARD_FRAGMENTS}
    query Products(${CONTEXT_VARS}, $first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) ${IN_CONTEXT} {
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        pageInfo { hasNextPage endCursor }
        nodes { ...ProductCardFields }
      }
    }
  `;

  const products: ProductSummary[] = [];
  let after: string | null = null;
  while (products.length < limit) {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: GqlProduct[];
      };
    } = await shopifyFetch(
      query,
      { first: Math.min(PAGE_SIZE, limit - products.length), after, sortKey, reverse },
      { context: true },
    );
    products.push(...data.products.nodes.map(mapProductSummary));
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
  }
  return products;
}

export async function fetchProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: GqlProduct | null }>(
    /* GraphQL */ `
      ${FULL_FRAGMENTS}
      query Product($handle: String!, ${CONTEXT_VARS}) ${IN_CONTEXT} {
        product(handle: $handle) { ...ProductFullFields }
      }
    `,
    { handle },
    { context: true },
  );
  return data.product ? mapProduct(data.product) : null;
}

export async function fetchProductHandles(limit: number) {
  const data = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>(
    /* GraphQL */ `
      query ProductHandles($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) { nodes { handle } }
      }
    `,
    { first: Math.min(limit, 250) },
  );
  return data.products.nodes.map((node) => node.handle);
}

/** Todos os produtos com data de atualização (para o sitemap). */
export async function fetchProductIndex() {
  const index: { handle: string; updatedAt: string }[] = [];
  let after: string | null = null;
  for (let page = 0; page < 20; page++) {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: { handle: string; updatedAt: string }[];
      };
    } = await shopifyFetch(
      /* GraphQL */ `
        query ProductIndex($after: String) {
          products(first: 250, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes { handle updatedAt }
          }
        }
      `,
      { after },
    );
    index.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
  }
  return index;
}

export async function fetchRecommendations(productId: string) {
  const data = await shopifyFetch<{ productRecommendations: GqlProduct[] | null }>(
    /* GraphQL */ `
      ${CARD_FRAGMENTS}
      query Recommendations($productId: ID!, ${CONTEXT_VARS}) ${IN_CONTEXT} {
        productRecommendations(productId: $productId, intent: RELATED) { ...ProductCardFields }
      }
    `,
    { productId },
    { context: true },
  );
  return (data.productRecommendations ?? []).map(mapProductSummary);
}

export async function searchCatalog(term: string) {
  const data = await shopifyFetch<{ search: { nodes: GqlProduct[] } }>(
    /* GraphQL */ `
      ${CARD_FRAGMENTS}
      query Search($term: String!, ${CONTEXT_VARS}) ${IN_CONTEXT} {
        search(query: $term, first: 36, types: PRODUCT) {
          nodes { ... on Product { ...ProductCardFields } }
        }
      }
    `,
    { term },
    { context: true },
  );
  return data.search.nodes.filter((node) => node.handle).map(mapProductSummary);
}

/* -------------------------------------------------------------------------- */
/* Coleções                                                                   */
/* -------------------------------------------------------------------------- */

type GqlCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  updatedAt: string;
  image?: GqlImage | null;
  seo?: { title?: string | null; description?: string | null };
};

function mapCollection(node: GqlCollection): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    updatedAt: node.updatedAt,
    image: mapImage(node.image),
    seo: { title: node.seo?.title ?? null, description: node.seo?.description ?? null },
  };
}

const COLLECTION_FIELDS = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id handle title description updatedAt
    seo { title description }
    image { ...ImageFields }
  }
`;

export async function fetchCollections() {
  const data = await shopifyFetch<{ collections: { nodes: GqlCollection[] } }>(
    /* GraphQL */ `
      ${IMAGE}
      ${COLLECTION_FIELDS}
      query Collections(${CONTEXT_VARS}) ${IN_CONTEXT} {
        collections(first: 50) { nodes { ...CollectionFields } }
      }
    `,
    {},
    { context: true },
  );
  return data.collections.nodes.map(mapCollection);
}

export async function fetchCollection(
  handle: string,
  sort: ProductSort = "default",
): Promise<CollectionWithProducts | null> {
  const sortKey =
    sort === "default"
      ? "COLLECTION_DEFAULT"
      : sort === "newest"
        ? "CREATED"
        : sort === "title"
          ? "TITLE"
          : "PRICE";
  const reverse = sort === "newest" || sort === "price-desc";

  const data = await shopifyFetch<{
    collection: (GqlCollection & { products: { nodes: GqlProduct[] } }) | null;
  }>(
    /* GraphQL */ `
      ${CARD_FRAGMENTS}
      ${COLLECTION_FIELDS}
      query Collection($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, ${CONTEXT_VARS}) ${IN_CONTEXT} {
        collection(handle: $handle) {
          ...CollectionFields
          products(first: 100, sortKey: $sortKey, reverse: $reverse) {
            nodes { ...ProductCardFields }
          }
        }
      }
    `,
    { handle, sortKey, reverse },
    { context: true },
  );
  if (!data.collection) return null;
  return {
    ...mapCollection(data.collection),
    products: data.collection.products.nodes.map(mapProductSummary),
  };
}

export async function fetchCollectionIndex() {
  const data = await shopifyFetch<{
    collections: { nodes: { handle: string; updatedAt: string }[] };
  }>(
    /* GraphQL */ `
      query CollectionIndex { collections(first: 100) { nodes { handle updatedAt } } }
    `,
  );
  return data.collections.nodes;
}

/* -------------------------------------------------------------------------- */
/* Menu e páginas                                                             */
/* -------------------------------------------------------------------------- */

/** Traduz URLs da Shopify (/collections/x) para as rotas deste site. */
function toLocalPath(url: string) {
  const config = getShopifyConfig();
  let path = url;
  try {
    const parsed = new URL(url);
    if (config && parsed.hostname !== config.domain && !parsed.hostname.endsWith(".myshopify.com")) {
      const own = new URL(site.url).hostname;
      if (parsed.hostname !== own) return url;
    }
    path = parsed.pathname;
  } catch {
    // URL relativa
  }
  if (path === "/collections/all") return "/produtos";
  return path
    .replace(/^\/collections\//, "/colecoes/")
    .replace(/^\/products\//, "/produtos/")
    .replace(/^\/pages\//, "/paginas/");
}

export async function fetchMenu(handle: string) {
  const data = await shopifyFetch<{
    menu: { items: { title: string; url: string }[] } | null;
  }>(
    /* GraphQL */ `
      query Menu($handle: String!) { menu(handle: $handle) { items { title url } } }
    `,
    { handle },
  );
  return (data.menu?.items ?? []).map((item) => ({
    title: item.title,
    href: toLocalPath(item.url),
  }));
}

export async function fetchPage(handle: string): Promise<PageContent | null> {
  const data = await shopifyFetch<{
    page: {
      handle: string;
      title: string;
      body: string;
      bodySummary: string;
      updatedAt: string;
    } | null;
  }>(
    /* GraphQL */ `
      query Page($handle: String!) {
        page(handle: $handle) { handle title body bodySummary updatedAt }
      }
    `,
    { handle },
  );
  if (!data.page) return null;
  return {
    handle: data.page.handle,
    title: data.page.title,
    body: cleanHtml(data.page.body),
    summary: data.page.bodySummary,
    updatedAt: data.page.updatedAt,
  };
}

/* -------------------------------------------------------------------------- */
/* Carrinho                                                                   */
/* -------------------------------------------------------------------------- */

type GqlCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: GqlMoney; totalAmount: GqlMoney };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: {
        totalAmount: GqlMoney;
        amountPerQuantity: GqlMoney;
        compareAtAmountPerQuantity?: GqlMoney | null;
      };
      merchandise: {
        id: string;
        title: string;
        selectedOptions: { name: string; value: string }[];
        image?: GqlImage | null;
        product: { handle: string; title: string; featuredImage?: GqlImage | null };
      };
    }[];
  };
};

function mapCart(cart: GqlCart): Cart {
  const lines: CartLine[] = cart.lines.nodes.map((line) => {
    const compareAt = line.cost.compareAtAmountPerQuantity;
    return {
      id: line.id,
      quantity: line.quantity,
      variantId: line.merchandise.id,
      variantTitle: line.merchandise.title,
      selectedOptions: line.merchandise.selectedOptions,
      productHandle: line.merchandise.product.handle,
      productTitle: line.merchandise.product.title,
      image: mapImage(line.merchandise.image ?? line.merchandise.product.featuredImage),
      unitPrice: line.cost.amountPerQuantity,
      compareAtUnitPrice:
        compareAt && Number(compareAt.amount) > Number(line.cost.amountPerQuantity.amount)
          ? compareAt
          : null,
      totalPrice: line.cost.totalAmount,
    };
  });
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    total: cart.cost.totalAmount,
    lines,
  };
}

type CartMutation<K extends string> = {
  [P in K]: { cart: GqlCart | null; userErrors: { message: string }[] };
};

function unwrapCart<K extends string>(data: CartMutation<K>, key: K): Cart {
  const result = data[key];
  if (result.userErrors.length) {
    throw new ShopifyError(result.userErrors.map((error) => error.message).join("; "));
  }
  if (!result.cart) throw new ShopifyError("A Shopify não devolveu o carrinho.");
  return mapCart(result.cart);
}

export async function cartGet(id: string, buyerIp?: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: GqlCart | null }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      query Cart($id: ID!) { cart(id: $id) { ...CartFields } }
    `,
    { id },
    { buyerIp },
  );
  return data.cart ? mapCart(data.cart) : null;
}

export async function cartCreate(variantId: string, quantity: number, buyerIp?: string) {
  const config = getShopifyConfig();
  const data = await shopifyFetch<CartMutation<"cartCreate">>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
        buyerIdentity: { countryCode: config?.country ?? "BR" },
      },
    },
    { buyerIp },
  );
  return unwrapCart(data, "cartCreate");
}

export async function cartLinesAdd(
  cartId: string,
  variantId: string,
  quantity: number,
  buyerIp?: string,
) {
  const data = await shopifyFetch<CartMutation<"cartLinesAdd">>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    { buyerIp },
  );
  return unwrapCart(data, "cartLinesAdd");
}

export async function cartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number,
  buyerIp?: string,
) {
  const data = await shopifyFetch<CartMutation<"cartLinesUpdate">>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] },
    { buyerIp },
  );
  return unwrapCart(data, "cartLinesUpdate");
}

export async function cartLinesRemove(cartId: string, lineId: string, buyerIp?: string) {
  const data = await shopifyFetch<CartMutation<"cartLinesRemove">>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lineIds: [lineId] },
    { buyerIp },
  );
  return unwrapCart(data, "cartLinesRemove");
}
