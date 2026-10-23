import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/components/art/product-image";
import { Price } from "@/components/shop/price";
import { QuickAdd } from "@/components/shop/quick-add";
import { installmentsFor } from "@/lib/promos";
import { colorInfo, colorLabel, isColorOption } from "@/lib/shop/labels";
import type { ProductSummary } from "@/lib/shop/types";
import { cn, discountPercent } from "@/lib/utils";

/** Bolinhas das cores disponíveis (até 5) e "+N"; só quando há mais de uma cor. */
function ColorDots({ product }: { product: ProductSummary }) {
  const option = product.options.find(isColorOption);
  if (!option || option.values.length < 2) return null;
  const shown = option.values.slice(0, 5);
  const extra = option.values.length - shown.length;
  return (
    <p className="flex items-center gap-1.5">
      <span className="sr-only">{option.values.length} cores</span>
      {shown.map((value) => (
        <span
          key={value}
          title={colorLabel(value)}
          aria-hidden="true"
          className="size-3 rounded-full border border-black/20"
          style={{ backgroundColor: colorInfo(value)?.hex ?? "#d9d9d9" }}
        />
      ))}
      {extra > 0 && <span aria-hidden="true" className="text-[11px] font-bold text-muted">+{extra}</span>}
    </p>
  );
}

/**
 * Card no padrão das lojas de roupa esportiva: a foto ocupa o card inteiro (as fotos dos fornecedores são
 * quadradas) e, em telas com mouse, a segunda foto aparece ao passar o cursor.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
  priority = false,
  className,
}: {
  product: ProductSummary;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const hasRange = Number(product.maxPrice.amount) > Number(product.price.amount);
  const cover = product.featuredImage;
  const second = cover ? product.images.find((image) => image.url !== cover.url) : undefined;
  const installments = installmentsFor(product.price);

  return (
    <article className={cn("group relative isolate flex flex-col", className)}>
      <div className="relative aspect-square overflow-hidden rounded-card bg-mist">
        {cover ? (
          <>
            <Image
              src={cover.url}
              alt={cover.altText || product.title}
              fill
              sizes={sizes}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            {second && (
              // Fica fora da tela de toque (display: none), então o navegador nem baixa a foto extra.
              <Image
                src={second.url}
                alt=""
                fill
                sizes={sizes}
                loading="lazy"
                className="hidden object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:hover)]:block"
              />
            )}
          </>
        ) : (
          <ProductImage
            image={null}
            art={product.art}
            alt={product.title}
            className="absolute inset-0 size-full p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-volt px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink">
              -{discount}%
            </span>
          )}
          {!product.availableForSale && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink">
              Esgotado
            </span>
          )}
        </div>

        <QuickAdd product={product} />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <ColorDots product={product} />
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink sm:text-sm">
          <Link href={`/produtos/${product.handle}`} className="after:absolute after:inset-0 after:content-['']">
            {product.title}
          </Link>
        </h3>
        <Price
          price={product.price}
          compareAt={product.compareAtPrice}
          from={hasRange}
          className="justify-start text-left text-sm"
        />
        {installments && <p className="-mt-1 text-xs text-muted">{installments}</p>}
      </div>
    </article>
  );
}
