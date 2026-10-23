import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getCollectionIndex, getProductIndex } from "@/lib/shop";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProductIndex(), getCollectionIndex()]);

  const fixed: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/produtos"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/colecoes"), changeFrequency: "weekly", priority: 0.8 },
    ...site.pages.map((page) => ({
      url: absoluteUrl(`/paginas/${page.handle}`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  return [
    ...fixed,
    ...collections
      .filter((collection) => collection.handle !== "frontpage" && collection.handle !== "all")
      .map((collection) => ({
        url: absoluteUrl(`/colecoes/${collection.handle}`),
        lastModified: collection.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...products.map((product) => ({
      url: absoluteUrl(`/produtos/${product.handle}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
