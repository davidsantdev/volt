export type Money = { amount: string; currencyCode: string };

export type ShopImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

/** Ilustração vetorial usada no modo demonstração (sem Shopify conectada). */
export type GarmentKind =
  | "hoodie"
  | "tank"
  | "tee"
  | "shorts"
  | "leggings"
  | "top"
  | "socks";
export type Colorway = "black" | "white" | "volt" | "lime" | "gray";
export type ArtSpec = { kind: GarmentKind; colorway: Colorway };

export type SelectedOption = { name: string; value: string };

export type Variant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopImage | null;
  art?: ArtSpec;
};

export type ProductOption = { name: string; values: string[] };

export type ProductSummary = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  createdAt: string;
  featuredImage: ShopImage | null;
  art?: ArtSpec;
  /** Menor preço entre as variantes. */
  price: Money;
  maxPrice: Money;
  /** Menor preço "de" quando o produto está em promoção. */
  compareAtPrice: Money | null;
  options: ProductOption[];
  variants: Variant[];
};

export type Product = ProductSummary & {
  description: string;
  descriptionHtml: string;
  updatedAt: string;
  images: ShopImage[];
  seo: { title: string | null; description: string | null };
  collections: { handle: string; title: string }[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  updatedAt: string;
  image: ShopImage | null;
  seo: { title: string | null; description: string | null };
};

export type CollectionWithProducts = Collection & { products: ProductSummary[] };

export type PageContent = {
  handle: string;
  title: string;
  /** HTML já sanitizado. */
  body: string;
  summary: string;
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  selectedOptions: SelectedOption[];
  productHandle: string;
  productTitle: string;
  image: ShopImage | null;
  art?: ArtSpec;
  unitPrice: Money;
  compareAtUnitPrice: Money | null;
  totalPrice: Money;
};

export type Cart = {
  id: string;
  /** Link do checkout hospedado na Shopify. Nulo no modo demonstração. */
  checkoutUrl: string | null;
  totalQuantity: number;
  subtotal: Money;
  total: Money;
  /** Cupons digitados; `applicable` diz se a Shopify aceitou para estes itens. */
  discountCodes?: { code: string; applicable: boolean }[];
  lines: CartLine[];
};

export type ShippingQuote = { title: string; description: string | null; cost: Money };

export type ProductSort = "default" | "price-asc" | "price-desc" | "newest" | "title";
