"use client";

import { useCart } from "@/components/cart/cart-provider";
import { BagIcon } from "@/components/ui/icons";

export function CartButton() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir carrinho"}
      className="relative grid size-11 place-items-center rounded-full bg-volt text-ink transition-colors duration-200 hover:bg-ink hover:text-volt"
    >
      <BagIcon className="size-[22px]" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-extrabold leading-5 text-white ring-2 ring-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
