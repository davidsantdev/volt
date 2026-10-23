"use client";

import Link from "next/link";
import { useId, useState, useTransition, type FormEvent } from "react";
import { estimateShippingAction, type ShippingResult } from "@/app/actions/cart";
import { ProductImage } from "@/components/art/product-image";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { BagIcon, CloseIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { site } from "@/config/site";
import { trackBeginCheckout } from "@/lib/analytics";
import { quantityDiscountLabel } from "@/lib/promos";
import { valueLabel } from "@/lib/shop/labels";
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

/** "Leve mais 1 e ganhe 10%": o desconto em si é automático na Shopify (site.quantityDiscount). */
function QuantityDiscountProgress({ quantity }: { quantity: number }) {
  const { minItems, percent } = site.quantityDiscount;
  if (!quantityDiscountLabel()) return null;
  const missing = Math.max(minItems - quantity, 0);
  const off = `${Math.round(percent * 100)}% de desconto`;
  return (
    <div className="border-b border-line px-5 py-4">
      <p className="text-xs font-semibold">
        {missing > 0 ? (
          <>
            Leve mais <strong className="font-extrabold">{missing === 1 ? "1 peça" : `${missing} peças`}</strong> e
            ganhe {off}
          </>
        ) : (
          <strong className="font-extrabold">Você ganhou {off}!</strong>
        )}
      </p>
      <ol aria-hidden="true" className="mt-2.5 flex gap-1.5">
        {Array.from({ length: minItems }, (_, index) => (
          <li
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors duration-500 ${index < quantity ? "bg-volt" : "bg-mist"}`}
          />
        ))}
      </ol>
    </div>
  );
}

function Line({ line }: { line: CartLine }) {
  const { setQuantity, removeLine, close, isPending } = useCart();
  const sale = isOnSale(line.unitPrice, line.compareAtUnitPrice);
  const options = line.selectedOptions.map((option) => valueLabel(option.value)).join(" · ");

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/produtos/${line.productHandle}`}
        onClick={close}
        className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-card bg-mist"
      >
        <ProductImage
          image={line.image}
          art={line.art}
          alt={line.productTitle}
          sizes="96px"
          fit="cover"
          blend={false}
          className={line.image ? "size-full" : "size-full p-2"}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-snug">
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

const fieldClass =
  "h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink";
const smallButton =
  "h-11 shrink-0 rounded-full bg-ink px-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-opacity disabled:opacity-50";

/** Cupom criado em Shopify → Descontos. Um por vez; se o novo não valer, o anterior volta. */
function CouponForm() {
  const { cart, applyDiscount, isPending } = useCart();
  const id = useId();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const active = cart?.discountCodes?.find((item) => item.applicable);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    const accepted = await applyDiscount(value);
    if (accepted) {
      setFeedback({ ok: true, text: `Cupom ${value.toUpperCase()} aplicado.` });
      setCode("");
    } else {
      setFeedback({ ok: false, text: "Cupom inválido ou não vale para estes itens." });
      await applyDiscount(active?.code ?? "");
    }
  }

  if (active) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-lime/60 px-4 py-3 text-xs font-bold">
        <span>
          Cupom <span className="uppercase">{active.code}</span> aplicado
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setFeedback(null);
            void applyDiscount("");
          }}
          className="underline underline-offset-4"
        >
          Remover
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-1.5">
      <label htmlFor={`${id}-coupon`} className="text-[11px] font-bold uppercase tracking-[0.14em]">
        Cupom de desconto
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-coupon`}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Digite o código"
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={50}
          className={fieldClass}
        />
        <button type="submit" disabled={isPending || !code.trim()} className={smallButton}>
          Aplicar
        </button>
      </div>
      {feedback && (
        <p role="status" className={`text-xs font-semibold ${feedback.ok ? "text-green-700" : "text-red-700"}`}>
          {feedback.text}
        </p>
      )}
    </form>
  );
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

/** Cotação real das taxas de Shopify → Frete e entrega para o CEP (o checkout já abre com ele). */
function ShippingEstimate() {
  const { cart } = useCart();
  const id = useId();
  const [cep, setCep] = useState("");
  const [quote, setQuote] = useState<{ signature: string; result: ShippingResult } | null>(null);
  const [pending, startTransition] = useTransition();
  // A cotação vale para os itens de agora: mudou o carrinho, ela some.
  const signature = `${cart?.totalQuantity ?? 0}:${cart?.subtotal.amount ?? 0}`;
  const result = quote?.signature === signature ? quote.result : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      setQuote({ signature, result: await estimateShippingAction(cep) });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-1.5">
      <label htmlFor={`${id}-cep`} className="text-[11px] font-bold uppercase tracking-[0.14em]">
        Calcular frete
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-cep`}
          value={cep}
          onChange={(event) => setCep(formatCep(event.target.value))}
          placeholder="00000-000"
          inputMode="numeric"
          autoComplete="postal-code"
          className={fieldClass}
        />
        <button type="submit" disabled={pending || cep.replace(/\D/g, "").length !== 8} className={smallButton}>
          {pending ? "…" : "Calcular"}
        </button>
      </div>
      {result &&
        (result.ok ? (
          <ul role="status" className="space-y-1 pt-1 text-xs">
            {result.place && <li className="text-muted">Entrega para {result.place}</li>}
            {result.options.map((option) => (
              <li key={option.title} className="flex justify-between gap-3 font-semibold">
                <span>
                  {option.title}
                  {option.description && <span className="font-normal text-muted"> · {option.description}</span>}
                </span>
                <span className="shrink-0 tabular-nums">
                  {Number(option.cost.amount) === 0 ? "Grátis" : formatMoney(option.cost)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="text-xs font-semibold text-red-700">
            {result.error}
          </p>
        ))}
    </form>
  );
}

export function CartDrawer() {
  const { cart, isOpen, close, error, isPending, isDemo } = useCart();
  const lines = cart?.lines ?? [];
  const subtotal = cart ? Number(cart.subtotal.amount) : 0;
  const discount = cart ? subtotal - Number(cart.total.amount) : 0;
  const activeCoupon = cart?.discountCodes?.find((item) => item.applicable);

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
            {cart && <QuantityDiscountProgress quantity={cart.totalQuantity} />}
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
              {!isDemo && (
                <div className="mb-4 space-y-3 border-b border-line pb-4">
                  <ShippingEstimate />
                  {activeCoupon ? (
                    <CouponForm />
                  ) : (
                    <details className="group">
                      <summary className="cursor-pointer text-xs font-bold underline-offset-4 hover:underline">
                        Tem um cupom de desconto?
                      </summary>
                      <div className="pt-2">
                        <CouponForm />
                      </div>
                    </details>
                  )}
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.14em]">Subtotal</span>
                <span className="text-xl font-extrabold tabular-nums">
                  {cart ? formatMoney(cart.subtotal) : ""}
                </span>
              </div>
              {cart && discount > 0.009 && (
                <>
                  <div className="mt-1 flex justify-between text-sm font-semibold text-green-700">
                    <span>Desconto</span>
                    <span className="tabular-nums">−{formatMoney(moneyFrom(discount, cart.subtotal.currencyCode))}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.14em]">Total</span>
                    <span className="text-xl font-extrabold tabular-nums">{formatMoney(cart.total)}</span>
                  </div>
                </>
              )}
              <p className="mt-1 text-xs text-muted">O frete final aparece no checkout, antes de você pagar.</p>

              {cart?.checkoutUrl ? (
                <a
                  href={cart.checkoutUrl}
                  onClick={() =>
                    trackBeginCheckout({
                      currency: cart.total.currencyCode,
                      items: cart.lines.map((line) => ({
                        id: line.variantId,
                        title: line.productTitle,
                        price: Number(line.unitPrice.amount),
                        quantity: line.quantity,
                      })),
                    })
                  }
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
