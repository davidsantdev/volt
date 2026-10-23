"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { PlusIcon } from "@/components/ui/icons";
import { variantLabel } from "@/lib/shop/labels";
import type { ProductSummary, Variant } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/** Botão "+" do cartão: adiciona direto (1 variação) ou abre o seletor de tamanho. */
export function QuickAdd({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!product.availableForSale) return null;

  const buttonClass =
    "absolute bottom-2.5 right-2.5 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-[0_6px_18px_-6px_rgba(13,15,12,0.45)] transition duration-200 hover:bg-ink hover:text-volt disabled:opacity-60";

  // Cor × tamanho (ou mais) não cabe num seletor de cartão: leva para a página do produto.
  if (product.options.length > 1) {
    return (
      <Link
        href={`/produtos/${product.handle}`}
        aria-label={`Ver opções de ${product.title}`}
        className={buttonClass}
      >
        <PlusIcon className="size-5" />
      </Link>
    );
  }

  const single = product.variants.length === 1;

  async function add(variant: Variant) {
    setBusyId(variant.id);
    const ok = await addItem({
      variantId: variant.id,
      preview: {
        variantTitle: variant.title,
        selectedOptions: variant.selectedOptions,
        productHandle: product.handle,
        productTitle: product.title,
        image: variant.image ?? product.featuredImage,
        art: variant.art ?? product.art,
        unitPrice: variant.price,
        compareAtUnitPrice: variant.compareAtPrice,
      },
    });
    setBusyId(null);
    if (ok) setOpen(false);
  }

  return (
    <div ref={rootRef}>
      <button
        type="button"
        aria-label={single ? `Adicionar ${product.title} ao carrinho` : `Escolher opção de ${product.title}`}
        aria-expanded={single ? undefined : open}
        disabled={busyId !== null}
        onClick={() => {
          if (single) void add(product.variants[0]);
          else setOpen((value) => !value);
        }}
        className={buttonClass}
      >
        <PlusIcon className={cn("size-5 transition-transform duration-200", open && "rotate-45")} />
      </button>

      {open && (
        <div
          role="group"
          aria-label={`Opções de ${product.title}`}
          className="absolute inset-x-2 bottom-2 z-20 max-h-[calc(100%-1rem)] overflow-y-auto rounded-2xl border border-line bg-white p-3 text-ink shadow-xl"
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em]">Escolha a opção</p>
          <ul className="flex flex-wrap gap-1.5">
            {product.variants.map((variant) => (
              <li key={variant.id}>
                <button
                  type="button"
                  disabled={!variant.availableForSale || busyId !== null}
                  onClick={() => void add(variant)}
                  className="h-9 min-w-9 rounded-full border border-line px-3 text-xs font-bold transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:line-through disabled:opacity-40"
                >
                  {variantLabel(variant.title)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
