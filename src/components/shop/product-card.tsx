import Link from "next/link";
import { ProductImage } from "@/components/art/product-image";
import { Price } from "@/components/shop/price";
import { QuickAdd } from "@/components/shop/quick-add";
import type { ProductSummary } from "@/lib/shop/types";
import { cn, discountPercent } from "@/lib/utils";

export type CardTone = "white" | "mist" | "volt" | "ink";

const tones: Record<CardTone, string> = {
  white: "border-line bg-white text-ink",
  mist: "border-transparent bg-mist text-ink",
  volt: "border-transparent bg-volt text-ink",
  ink: "border-transparent bg-ink text-white",
};

export function ProductCard({
  product,
  tone = "mist",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className,
  mediaClassName,
}: {
  product: ProductSummary;
  tone?: CardTone;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Proporção da área da imagem (padrão 4:5). */
  mediaClassName?: string;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const hasRange = Number(product.maxPrice.amount) > Number(product.price.amount);

  return (
    <article
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-card border transition-shadow duration-300 hover:shadow-[0_22px_44px_-28px_rgba(13,15,12,0.55)]",
        tones[tone],
        className,
      )}
    >
      <div className={cn("relative min-h-0 flex-1 overflow-hidden", mediaClassName ?? "aspect-[4/5]")}>
        {/* Absoluta: com `h-full` a foto ignorava a altura do card (aspect-ratio) e passava por cima do nome. */}
        <ProductImage
          image={product.featuredImage}
          art={product.art}
          alt={product.title}
          sizes={sizes}
          priority={priority}
          blend={tone !== "ink"}
          className="absolute inset-0 h-full w-full p-2 transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:p-4"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-lime">
              -{discount}%
            </span>
          )}
          {!product.availableForSale && (
            <span className="rounded-full border border-ink/20 bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink">
              Esgotado
            </span>
          )}
        </div>
      </div>

      <QuickAdd product={product} />

      <div className="flex flex-col items-start gap-1.5 px-4 pb-4 pt-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:px-5 sm:pb-5">
        <h3 className="min-w-0 text-[11px] font-extrabold uppercase leading-snug tracking-[0.06em] sm:text-xs">
          <Link
            href={`/produtos/${product.handle}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.title}
          </Link>
        </h3>
        <Price
          price={product.price}
          compareAt={product.compareAtPrice}
          from={hasRange}
          className="shrink-0 flex-col items-start gap-0 text-left text-[13px] sm:items-end sm:text-right sm:text-sm"
        />
      </div>
    </article>
  );
}
