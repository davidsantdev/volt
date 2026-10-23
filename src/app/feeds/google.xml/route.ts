import { site } from "@/config/site";
import { getProduct, getProductIndex } from "@/lib/shop";
import { colorLabel, isColorOption, isSizeOption, sizeLabel } from "@/lib/shop/labels";
import type { Money, Product } from "@/lib/shop/types";
import { absoluteUrl, isOnSale, numericId, truncate } from "@/lib/utils";

/**
 * Feed de produtos para o Google Merchant Center (Shopping e listagens grátis) e para o catálogo da Meta, com os
 * links deste site. Uma linha por variação (cor e tamanho), agrupada pelo produto; os ids são os mesmos que os
 * pixels enviam (src/lib/analytics.ts). Cadastre https://SEU-DOMINIO/feeds/google.xml como feed programado nos dois.
 * Usa o mesmo cache do catálogo: os webhooks da Shopify atualizam o feed junto com o site.
 */
export async function GET() {
  const index = await getProductIndex();
  const products = await Promise.all(index.map((entry) => getProduct(entry.handle)));
  const items = products.filter((product): product is Product => product !== null).flatMap(productItems);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "<channel>",
    tag("title", site.name),
    tag("link", site.url),
    tag("description", site.description),
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

function productItems(product: Product): string[] {
  const colorOption = product.options.find(isColorOption)?.name;
  const sizeOption = product.options.find(isSizeOption)?.name;
  const collections = new Set(product.collections.map((collection) => collection.handle));
  const [female, male] = [collections.has("feminino"), collections.has("masculino")];
  const gender = female === male ? "unisex" : female ? "female" : "male";
  const description = truncate(product.description || product.title, 5000);
  const photos = product.images.map((image) => image.url);

  return product.variants.flatMap((variant) => {
    const option = (name?: string) => variant.selectedOptions.find((selected) => selected.name === name)?.value;
    const color = option(colorOption);
    const size = option(sizeOption);
    const image = variant.image?.url ?? product.featuredImage?.url ?? photos[0];
    if (!image) return [];

    const onSale = isOnSale(variant.price, variant.compareAtPrice);
    const title = [product.title, color && colorLabel(color), size && sizeLabel(size)].filter(Boolean).join(" - ");
    return [
      [
        "<item>",
        tag("g:id", numericId(variant.id)),
        tag("g:item_group_id", numericId(product.id)),
        tag("title", truncate(title, 150)),
        tag("description", description),
        tag("link", absoluteUrl(`/produtos/${product.handle}`)),
        tag("g:image_link", image),
        ...photos
          .filter((url) => url !== image)
          .slice(0, 10)
          .map((url) => tag("g:additional_image_link", url)),
        tag("g:availability", variant.availableForSale ? "in_stock" : "out_of_stock"),
        tag("g:price", price(onSale && variant.compareAtPrice ? variant.compareAtPrice : variant.price)),
        onSale ? tag("g:sale_price", price(variant.price)) : "",
        tag("g:brand", site.name),
        tag("g:condition", "new"),
        tag("g:identifier_exists", "no"),
        tag("g:gender", gender),
        tag("g:age_group", "adult"),
        color ? tag("g:color", colorLabel(color)) : "",
        size ? tag("g:size", sizeLabel(size)) : "",
        product.productType ? tag("g:product_type", product.productType) : "",
        "</item>",
      ]
        .filter(Boolean)
        .join(""),
    ];
  });
}

function price(money: Money) {
  return `${Number(money.amount).toFixed(2)} ${money.currencyCode}`;
}

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };

/** Escapa o texto e tira caracteres de controle, que deixam o XML inválido. */
function tag(name: string, value: string) {
  const text = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/[&<>"']/g, (char) => ENTITIES[char]);
  return `<${name}>${text}</${name}>`;
}
