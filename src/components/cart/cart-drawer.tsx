"use client";

import Link from "next/link";
import { ProductImage } from "@/components/art/product-image";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { BagIcon, CloseIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { site } from "@/config/site";
import { colorLabel } from "@/lib/shop/labels";
import type { CartLine } from "@/lib/shop/types";
import { formatMoney, isOnSale, moneyFrom } from "@/lib/utils";

function FreeShippingProgress({ subtotal, currency }: { subtotal: number; currency: string }) {
  const goal = site.freeShippingThreshold;
  if (!goal || currency !== site.currency) return null;
  const missing = Math.max(goal - subtotal, 0);
  const percent = Math.min((subtotal / goal) * 100, 100);
  return (
    <div className="border-b border-line px-5 py-4">
      <p className="text-xs font-semibold">
        {missing > 0 ? (
          <>
            Faltam <strong className="font-extrabold">{formatMoney(moneyFrom(missing, currency))}</strong> para o
            frete grátis
          </>
        ) : (
          <strong className="font-extrabold">Você ganhou frete grátis!</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progresso para o frete grátis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-mist"
      >
        <div
          className="h-full rounded-full bg-volt transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Line({ line }: { line: CartLine }) {
  const { setQuantity, removeLine, close, isPending } = useCart();
  const sale = isOnSale(line.unitPrice, line.compareAtUnitPrice);
  const options = line.selectedOptions.map((option) => colorLabel(option.value)).join(" · ");

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/produtos/${line.productHandle}`}
        onClick={close}
        className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-mist"
      >
        <ProductImage
          image={line.image}
          art={line.art}
          alt={line.productTitle}
          sizes="96px"
          className="size-full p-2"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase leading-snug tracking-[0.04em]">
              <Link href={`/produtos/${line.productHandle}`} onClick={close}>
                {line.productTitle}
              </Link>
            </p>
            {options && <p className="mt-1 text-xs text-muted">{options}</p>}
          </div>
          <button
            type="button"
            aria-label={`Remover ${line.productTitle}`}
            disabled={isPending}
            onClick={() => void removeLine(line.id)}
            className="-m-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper
            value={line.quantity}
            disabled={isPending}
            max={99}
            label={`Quantidade de ${line.productTitle}`}
            onChange={(value) => void setQuantity(line.id, value)}
          />
          <p className="text-right text-sm font-extrabold tabular-nums">
            {formatMoney(line.totalPrice)}
            {sale && line.compareAtUnitPrice && (
              <s className="block text-xs font-semibold text-muted">
                {formatMoney(
                  moneyFrom(
                    Number(line.compareAtUnitPrice.amount) * line.quantity,
                    line.compareAtUnitPrice.currencyCode,
                  ),
                )}
              </s>
            )}
          </p>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { cart, isOpen, close, error, isPending, isDemo } = useCart();
  const lines = cart?.lines ?? [];
  const subtotal = cart ? Number(cart.subtotal.amount) : 0;

  return (
    <Drawer open={isOpen} onClose={close} label="Carrinho de compras">
      <div className="flex h-full flex-col">
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em]">
            Seu carrinho{cart && cart.totalQuantity > 0 ? ` (${cart.totalQuantity})` : ""}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar carrinho"
            className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 place-content-center justify-items-center gap-5 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-mist">
              <BagIcon className="size-7" />
            </span>
            <div>
              <p className="text-lg font-extrabold uppercase tracking-[-0.01em]">Seu carrinho está vazio</p>
              <p className="mt-2 text-sm text-ink-soft">Escolha suas peças e comece a treinar com conforto.</p>
            </div>
            <ButtonLink href="/produtos" onClick={close} variant="volt">
              Ver produtos
            </ButtonLink>
          </div>
        ) : (
          <>
            {cart && <FreeShippingProgress subtotal={subtotal} currency={cart.subtotal.currencyCode} />}
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <Line key={line.id} line={line} />
              ))}
            </ul>

            <div className="shrink-0 border-t border-line bg-white px-5 pb-5 pt-4">
              {error && (
                <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
                  {error}
                </p>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.14em]">Subtotal</span>
                <span className="text-xl font-extrabold tabular-nums">
                  {cart ? formatMoney(cart.subtotal) : ""}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Frete e descontos são calculados no checkout.</p>

              {cart?.checkoutUrl ? (
                <a
                  href={cart.checkoutUrl}
                  aria-disabled={isPending}
                  className={buttonClasses({ size: "lg", variant: "solid", className: "mt-4 w-full" })}
                >
                  Finalizar compra
                </a>
              ) : (
                <>
                  <Button size="lg" className="mt-4 w-full" disabled>
                    Finalizar compra
                  </Button>
                  {isDemo && (
                    <p className="mt-3 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
                      <strong className="font-bold text-ink">Modo demonstração.</strong> Conecte a sua loja Shopify
                      (veja o README) para liberar o checkout.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
