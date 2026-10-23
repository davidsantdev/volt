import type { Money } from "@/lib/shop/types";
import { cn, formatMoney, isOnSale } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  from = false,
  className,
  priceClassName,
}: {
  price: Money;
  compareAt?: Money | null;
  /** Mostra "a partir de" quando as variantes têm preços diferentes. */
  from?: boolean;
  className?: string;
  priceClassName?: string;
}) {
  const sale = isOnSale(price, compareAt ?? null);
  return (
    <p className={cn("flex flex-wrap items-baseline justify-end gap-x-2 text-right", className)}>
      {from && <span className="text-[10px] font-semibold normal-case opacity-70">a partir de</span>}
      <span className={cn("font-extrabold tabular-nums", priceClassName)}>
        <span className="sr-only">Preço: </span>
        {formatMoney(price)}
      </span>
      {sale && compareAt && (
        <s className="text-[0.8em] font-semibold tabular-nums opacity-60">
          <span className="sr-only">Preço original: </span>
          {formatMoney(compareAt)}
        </s>
      )}
    </p>
  );
}
