import { cacheLife, cacheTag } from "next/cache";
import { site, type NavItem } from "@/config/site";
import { isShopifyConfigured } from "./config";
import * as mock from "./mock";
import * as shopify from "./shopify";
import type {
  Collection,
  CollectionWithProducts,
  PageContent,
  Product,
  ProductSort,
  ProductSummary,
} from "./types";

/**
 * Camada de dados única do site. Tudo que as páginas precisam passa por aqui:
 * com Shopify configurada lê a Storefront API, sem ela usa o catálogo de demo.
 *
 * Cada leitura é cacheada ("use cache") e etiquetada, para que os webhooks da
 * Shopify (src/app/api/shopify/revalidate) possam invalidar só o que mudou.
 */

export { isShopifyConfigured };

export async function getProducts(sort: ProductSort = "default"): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  return isShopifyConfigured() ? shopify.listProducts(sort) : mock.mockListProducts(sort);
}

/** Destaques da home: usa a coleção especial se existir, senão ordena o catálogo. */
export async function getFeaturedProducts(
  kind: "best" | "new",
  limit = 8,
): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", "collections");

  const handle = kind === "best" ? site.collections.best : site.collections.new;
  const collection = isShopifyConfigured()
    ? await shopify.fetchCollection(handle)
    : mock.mockCollection(handle);
  if (collection && collection.products.length > 0) {
    return collection.products.slice(0, limit);
  }

  const sort: ProductSort = kind === "best" ? "default" : "newest";
  const products = isShopifyConfigured()
    ? await shopify.listProducts(sort, limit)
    : mock.mockListProducts(sort);
  return products.slice(0, limit);
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheTag(`product:${handle}`);

  const product = isShopifyConfigured()
    ? await shopify.fetchProduct(handle)
    : mock.mockGetProduct(handle);
  // Produto inexistente: cache curto, para um produto recém-criado aparecer logo.
  if (product) cacheLife("catalog");
  else cacheLife("minutes");
  return product;
}

export async function getProductHandles(limit = 100): Promise<string[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  return isShopifyConfigured() ? shopify.fetchProductHandles(limit) : mock.mockHandles(limit);
}

export async function getProductIndex() {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  return isShopifyConfigured() ? shopify.fetchProductIndex() : mock.mockIndex();
}

export async function getRecommendations(
  handle: string,
  productId: string,
): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products", `product:${handle}`);
  return isShopifyConfigured()
    ? shopify.fetchRecommendations(productId)
    : mock.mockRecommendations(handle);
}

export async function searchProducts(term: string): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("products");
  const query = term.trim().slice(0, 80);
  if (!query) return [];
  return isShopifyConfigured() ? shopify.searchCatalog(query) : mock.mockSearch(query);
}

/** Até 6 sugestões para a busca instantânea do cabeçalho. */
export async function suggestProducts(term: string): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  const query = term.trim().slice(0, 60);
  if (query.length < 2) return [];
  if (!isShopifyConfigured()) return mock.mockSearch(query).slice(0, 6);
  return (await shopify.predictiveSearchProducts(query)).slice(0, 6);
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("collections");
  const collections = isShopifyConfigured() ? await shopify.fetchCollections() : mock.mockCollections();
  // Feminino e Masculino primeiro; o resto mantém a ordem original (sort estável).
  const rank = (handle: string) => {
    const index = site.collections.priority.indexOf(handle);
    return index === -1 ? site.collections.priority.length : index;
  };
  return [...collections].sort((a, b) => rank(a.handle) - rank(b.handle));
}

export async function getCollection(handle: string): Promise<CollectionWithProducts | null> {
  "use cache";
  // Depende dos produtos (preço e estoque aparecem na listagem), então também usa "products".
  cacheTag("collections", "products", `collection:${handle}`);

  const collection = isShopifyConfigured()
    ? await shopify.fetchCollection(handle)
    : mock.mockCollection(handle);
  if (collection) cacheLife("catalog");
  else cacheLife("minutes");
  return collection;
}

export async function getCollectionIndex() {
  "use cache";
  cacheLife("catalog");
  cacheTag("collections");
  return isShopifyConfigured() ? shopify.fetchCollectionIndex() : mock.mockCollectionIndex();
}

/**
 * Destinos das coleções especiais. "Lançamentos" e "Mais vendidos" só viram link
 * se o lojista criou a coleção na Shopify; sem ela, "Lançamentos" leva à vitrine
 * geral e "Mais vendidos" some (uma loja nova ainda não tem vendas para mostrar).
 */
export async function getSpecialLinks(): Promise<{ newHref: string; bestHref: string | null }> {
  "use cache";
  cacheLife("catalog");
  cacheTag("collections");

  const handles = new Set((await getCollections()).map((collection) => collection.handle));
  return {
    newHref: handles.has(site.collections.new) ? `/colecoes/${site.collections.new}` : "/produtos",
    bestHref: handles.has(site.collections.best) ? `/colecoes/${site.collections.best}` : null,
  };
}

/** Menu padrão do site, sem links para coleções que ainda não existem. */
async function defaultMenu(): Promise<NavItem[]> {
  const handles = new Set((await getCollections()).map((collection) => collection.handle));
  return site.nav.filter((item) => {
    const handle = item.href.match(/^\/colecoes\/([^/]+)$/)?.[1];
    return !handle || handles.has(handle);
  });
}

/** O menu que a Shopify cria sozinha (Início, Catálogo, Contato) não foi personalizado: não serve de navegação. */
function isShopifyStarterMenu(items: NavItem[]) {
  return items.every((item) => ["/", "/produtos", "/paginas/contact", "/paginas/contato"].includes(item.href));
}

export async function getMenu(): Promise<NavItem[]> {
  "use cache";
  cacheLife("content");
  cacheTag("menu", "collections");

  if (!isShopifyConfigured()) return defaultMenu();
  try {
    const items = await shopify.fetchMenu(site.menuHandle);
    return items.length > 0 && !isShopifyStarterMenu(items) ? items : await defaultMenu();
  } catch {
    // Sem permissão de leitura de menus, ou menu inexistente: usa o padrão.
    return defaultMenu();
  }
}

export async function getPage(handle: string): Promise<PageContent | null> {
  "use cache";
  cacheLife("content");
  cacheTag("pages", `page:${handle}`);
  if (!isShopifyConfigured()) return mock.mockPage(handle);
  try {
    // Página padrão ainda não criada na Shopify: usa o texto de exemplo (evita 404 nos links do rodapé).
    return (await shopify.fetchPage(handle)) ?? mock.mockPage(handle);
  } catch {
    return mock.mockPage(handle);
  }
}
