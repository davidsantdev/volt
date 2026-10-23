"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ProductImage } from "@/components/art/product-image";
import { useCart } from "@/components/cart/cart-provider";
import { Price } from "@/components/shop/price";
import { SizeGuideButton } from "@/components/shop/size-guide";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { site } from "@/config/site";
import { installmentsFor } from "@/lib/promos";
import { colorInfo, colorLabel, isColorOption, optionLabel, sizeLabel } from "@/lib/shop/labels";
import type { ArtSpec, Colorway, Product, ShopImage, Variant } from "@/lib/shop/types";
import { cn, discountPercent, formatMoney, moneyFrom } from "@/lib/utils";

type Selection = Record<string, string>;
type Tone = "mist" | "volt" | "lime" | "ink";
type Slide = { image: ShopImage | null; art?: ArtSpec; tone: Tone };


const TONE_CLASS: Record<Tone, string> = {
  mist: "bg-mist",
  volt: "bg-volt",
  lime: "bg-lime",
  ink: "bg-ink",
};

function initialSelection(product: Product): Selection {
  const first = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const selection: Selection = {};
  for (const option of product.options) {
    if (option.values.length === 1) {
      selection[option.name] = option.values[0];
    } else if (isColorOption(option) && first) {
      // Cor já vem escolhida; tamanho o cliente escolhe (menos devolução por tamanho errado).
      selection[option.name] =
        first.selectedOptions.find((item) => item.name === option.name)?.value ?? option.values[0];
    }
  }
  return selection;
}

function findVariant(product: Product, selection: Selection): Variant | undefined {
  if (product.options.length === 0) return product.variants[0];
  if (product.options.some((option) => !selection[option.name])) return undefined;
  return product.variants.find((variant) =>
    variant.selectedOptions.every((item) => selection[item.name] === item.value),
  );
}

function valueAvailable(product: Product, selection: Selection, name: string, value: string) {
  return product.variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.some((item) => item.name === name && item.value === value) &&
      variant.selectedOptions.every(
        (item) => item.name === name || !selection[item.name] || selection[item.name] === item.value,
      ),
  );
}

/** Foto em tela cheia com setas (teclado ← →), para ver tecido e caimento de perto. */
function Lightbox({
  images,
  index,
  title,
  onIndex,
  onClose,
}: {
  images: ShopImage[];
  index: number;
  title: string;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const image = images[index];
  const go = (step: number) => onIndex((index + step + images.length) % images.length);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const arrow =
    "absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl font-bold shadow transition-colors hover:bg-white";
  return (
    <dialog
      ref={ref}
      aria-label={`Fotos de ${title}`}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-white p-0 backdrop:bg-black/70"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="text-xs font-bold tabular-nums">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar fotos"
            className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="relative flex-1 bg-mist">
          <Image src={image.url} alt={image.altText || title} fill sizes="100vw" className="object-contain" />
          {images.length > 1 && (
            <>
              <button type="button" aria-label="Foto anterior" onClick={() => go(-1)} className={`${arrow} left-3`}>
                ‹
              </button>
              <button type="button" aria-label="Próxima foto" onClick={() => go(1)} className={`${arrow} right-3`}>
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}

function tonesFor(colorway: Colorway): Tone[] {
  return colorway === "volt" ? ["mist", "ink", "lime"] : ["mist", "volt", "lime"];
}

function buildSlides(product: Product, variant?: Variant): Slide[] {
  if (product.images.length > 0) {
    return product.images.map((image) => ({ image, tone: "mist" as const }));
  }
  const art = variant?.art ?? product.art;
  if (!art) return [{ image: null, tone: "mist" }];
  return tonesFor(art.colorway).map((tone) => ({ image: null, art, tone }));
}

export function ProductExperience({
  product,
  header,
  benefits,
  details,
}: {
  product: Product;
  /** Eyebrow + H1 renderizados no servidor. */
  header: ReactNode;
  benefits: ReactNode;
  details: ReactNode;
}) {
  const { addItem, isPending } = useCart();
  const uid = useId();
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [picked, setPicked] = useState<{ key: string; index: number } | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [zoom, setZoom] = useState<number | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  // Barra fixa de compra no celular: aparece quando o botão principal sai da tela (e some sobre o rodapé).
  const [buyInView, setBuyInView] = useState(true);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const buy = buyRef.current;
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === buy) setBuyInView(entry.isIntersecting);
        else setFooterInView(entry.isIntersecting);
      }
    });
    if (buy) observer.observe(buy);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const variant = useMemo(() => findVariant(product, selection), [product, selection]);
  const slides = useMemo(() => buildSlides(product, variant), [product, variant]);

  // Slide ativo derivado (sem efeito): vale o que o cliente clicou na miniatura e, ao
  // trocar de variação com foto própria, passa a valer a foto daquela variação.
  const variantKey = variant?.image?.url ?? "";
  const variantSlide = variantKey ? product.images.findIndex((image) => image.url === variantKey) : -1;
  const activeSlide = picked && picked.key === variantKey ? picked.index : Math.max(variantSlide, 0);
  const slide = slides[Math.min(activeSlide, slides.length - 1)];

  const price = variant?.price ?? product.price;
  const compareAt = variant ? variant.compareAtPrice : product.compareAtPrice;
  const discount = discountPercent(price, compareAt);
  const unavailable = variant ? !variant.availableForSale : !product.availableForSale;
  const hasRange = !variant && Number(product.maxPrice.amount) > Number(product.price.amount);

  function select(name: string, value: string) {
    setSelection((current) => ({ ...current, [name]: value }));
    setMissing([]);
    setQuantity(1);
  }

  async function handleAdd() {
    if (!variant) {
      setMissing(product.options.filter((option) => !selection[option.name]).map((option) => option.name));
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    await addItem({
      variantId: variant.id,
      quantity,
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
  }

  const pixPrice =
    site.pixDiscount > 0 && price.currencyCode === site.currency
      ? moneyFrom(Number(price.amount) * (1 - site.pixDiscount), price.currencyCode)
      : null;

  const optionViews = product.options.map((option) => ({ option, isColor: isColorOption(option) }));
  const installments = installmentsFor(price);
  const firstMissing = optionViews.find(({ option }) => !selection[option.name]);
  const stickyLabel = unavailable
    ? "Esgotado"
    : variant
      ? "Adicionar"
      : `Escolher ${firstMissing?.isColor ? "cor" : optionLabel(firstMissing?.option.name ?? "opção").toLowerCase()}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
      {/* Galeria */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className={cn("relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[1.5rem]", TONE_CLASS[slide.tone])}>
          <ProductImage
            image={slide.image}
            art={slide.art}
            alt={product.title}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            blend={slide.tone !== "ink"}
            className="size-full p-8 sm:p-14"
          />
          {slide.image && (
            <button
              type="button"
              onClick={() => setZoom(Math.min(activeSlide, slides.length - 1))}
              aria-label="Ampliar foto"
              className="absolute inset-0 cursor-zoom-in"
            />
          )}
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-lime">
              -{discount}%
            </span>
          )}
        </div>

        {slides.length > 1 && (
          <ul className="hide-scrollbar mt-3 flex gap-3 overflow-x-auto" aria-label="Imagens do produto">
            {slides.map((item, index) => (
              <li key={index} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setPicked({ key: variantKey, index })}
                  aria-label={`Ver imagem ${index + 1} de ${slides.length}`}
                  aria-current={index === activeSlide}
                  className={cn(
                    "grid size-[4.5rem] place-items-center overflow-hidden rounded-2xl border-2 transition-colors sm:size-20",
                    TONE_CLASS[item.tone],
                    index === activeSlide ? "border-ink" : "border-transparent hover:border-ink/40",
                  )}
                >
                  <ProductImage
                    image={item.image}
                    art={item.art}
                    alt=""
                    sizes="80px"
                    blend={item.tone !== "ink"}
                    className="size-full p-1.5"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Informações e compra */}
      <div>
        {header}

        <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
          <Price
            price={price}
            compareAt={compareAt}
            from={hasRange}
            className="justify-start text-left"
            priceClassName="text-3xl"
          />
        </div>
        {pixPrice && (
          <p className="mt-1.5 text-sm text-ink-soft">
            ou <strong className="font-extrabold text-ink">{formatMoney(pixPrice)}</strong> no Pix (
            {Math.round(site.pixDiscount * 100)}% off)
          </p>
        )}
        {installments && <p className="mt-1 text-sm text-ink-soft">{installments}</p>}

        <div ref={optionsRef} className="mt-7 space-y-6">
          {optionViews.map(({ option, isColor }) => (
            <fieldset key={option.name} aria-describedby={missing.includes(option.name) ? `${uid}-error` : undefined}>
              <legend className="mb-3 flex items-baseline gap-2 text-[11px] font-bold uppercase tracking-[0.16em]">
                {isColor ? "Cor" : optionLabel(option.name)}
                {selection[option.name] && (
                  <span className="text-xs font-semibold normal-case tracking-normal text-muted">
                    {isColor ? colorLabel(selection[option.name]) : sizeLabel(selection[option.name])}
                  </span>
                )}
                {!isColor && optionLabel(option.name) === "Tamanho" && <SizeGuideButton productTitle={product.title} />}
              </legend>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const id = `${uid}-${option.name}-${value}`.replace(/\s+/g, "-");
                  const available = valueAvailable(product, selection, option.name, value);
                  const swatch = isColor ? colorInfo(value)?.hex : undefined;
                  return (
                    <div key={value}>
                      <input
                        id={id}
                        type="radio"
                        name={`${uid}-${option.name}`}
                        value={value}
                        checked={selection[option.name] === value}
                        onChange={() => select(option.name, value)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={id}
                        className={cn(
                          "flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors hover:border-ink",
                          "border-line peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white",
                          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-focus-visible:shadow-[0_0_0_5px_var(--color-volt)]",
                          !available && "text-muted line-through",
                          missing.includes(option.name) && "border-red-600",
                        )}
                      >
                        {swatch && (
                          <span
                            aria-hidden="true"
                            className="size-4 rounded-full border border-black/20"
                            style={{ backgroundColor: swatch }}
                          />
                        )}
                        {isColor ? colorLabel(value) : sizeLabel(value)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {missing.length > 0 && (
          <p id={`${uid}-error`} role="alert" className="mt-4 text-sm font-semibold text-red-700">
            Selecione{" "}
            {missing
              .map((name) => (optionViews.find((view) => view.option.name === name)?.isColor ? "Cor" : optionLabel(name)).toLowerCase())
              .join(" e ")}{" "}
            para continuar.
          </p>
        )}

        <div ref={buyRef} className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={10}
            disabled={unavailable}
            className="h-14 [&_button]:size-11"
          />
          <Button
            size="lg"
            className="min-w-0 px-4 sm:px-9"
            aria-label={unavailable ? "Esgotado" : "Adicionar ao carrinho"}
            onClick={() => void handleAdd()}
            disabled={unavailable || isPending}
          >
            {unavailable ? (
              "Esgotado"
            ) : isPending ? (
              "Adicionando…"
            ) : (
              <>
                <span className="sm:hidden">Adicionar</span>
                <span className="hidden sm:inline">Adicionar ao carrinho</span>
              </>
            )}
          </Button>
        </div>

        {benefits}
        {details}
      </div>

      {zoom !== null && product.images.length > 0 && (
        <Lightbox
          images={product.images}
          index={Math.min(zoom, product.images.length - 1)}
          title={product.title}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}

      {!buyInView && !footerInView && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.04em]">{product.title}</p>
              <p className="text-sm font-extrabold tabular-nums">{formatMoney(price)}</p>
            </div>
            <Button
              size="lg"
              className="shrink-0 px-6"
              onClick={() => void handleAdd()}
              disabled={unavailable || isPending}
            >
              {isPending ? "Adicionando…" : stickyLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
