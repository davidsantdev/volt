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

/** Variação que dá a foto: a escolhida ou, com só a cor escolhida, a primeira daquela cor. */
function previewVariant(product: Product, selection: Selection): Variant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((item) => !selection[item.name] || selection[item.name] === item.value),
  );
}

function buildSlides(product: Product, variant?: Variant): Slide[] {
  if (product.images.length > 0) {
    // A foto da cor escolhida vem primeiro.
    const lead = variant?.image ? product.images.find((image) => image.url === variant.image!.url) : undefined;
    const images = lead ? [lead, ...product.images.filter((image) => image !== lead)] : product.images;
    return images.map((image) => ({ image, tone: "mist" as const }));
  }
  const art = variant?.art ?? product.art;
  if (!art) return [{ image: null, tone: "mist" }];
  return tonesFor(art.colorway).map((tone) => ({ image: null, art, tone }));
}

/** Foto (ou ilustração) cobrindo o quadrado; foto que não é quadrada aparece inteira. */
function SlideMedia({ slide, alt, sizes, priority }: { slide: Slide; alt: string; sizes: string; priority: boolean }) {
  if (slide.image) {
    const square = Math.abs(slide.image.width / slide.image.height - 1) < 0.05;
    return (
      <Image
        src={slide.image.url}
        alt={slide.image.altText || alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={square ? "object-cover" : "object-contain"}
      />
    );
  }
  return (
    <ProductImage
      image={null}
      art={slide.art}
      alt={alt}
      blend={slide.tone !== "ink"}
      className="absolute inset-0 size-full p-10 sm:p-16"
    />
  );
}

const DESKTOP_PHOTOS = 7;

/**
 * Uma lista só: carrossel de arrastar (tela cheia) no celular e grade de fotos grandes no desktop, como na
 * Gymshark. Mesma marcação nos dois casos, para o navegador não baixar a mesma foto duas vezes.
 */
function Gallery({
  slides,
  title,
  discount,
  onZoom,
}: {
  slides: Slide[];
  title: string;
  discount: number;
  onZoom: (index: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const shown = Math.min(slides.length, DESKTOP_PHOTOS);
  const hidden = slides.length - shown;
  const wideFirst = shown % 2 === 1;

  return (
    <div className="bleed relative lg:mx-0">
      <ul
        onScroll={(event) =>
          setCurrent(Math.round(event.currentTarget.scrollLeft / Math.max(event.currentTarget.clientWidth, 1)))
        }
        aria-label="Fotos do produto"
        className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible"
      >
        {slides.map((slide, index) => {
          const wide = index === 0 && wideFirst;
          return (
            <li
              key={slide.image?.url ?? `${slide.tone}-${index}`}
              className={cn(
                "relative aspect-square w-full shrink-0 snap-center overflow-hidden lg:w-auto lg:rounded-card",
                TONE_CLASS[slide.tone],
                wide && "lg:col-span-2",
                index >= DESKTOP_PHOTOS && "lg:hidden",
              )}
            >
              <SlideMedia
                slide={slide}
                alt={index === 0 ? title : `${title} — foto ${index + 1}`}
                priority={index === 0}
                sizes={wide ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 28vw, 100vw"}
              />
              {slide.image && (
                <button
                  type="button"
                  onClick={() => onZoom(index)}
                  aria-label={`Ampliar foto ${index + 1} de ${slides.length}`}
                  className="absolute inset-0 cursor-zoom-in"
                />
              )}
              {index === shown - 1 && hidden > 0 && (
                <button
                  type="button"
                  onClick={() => onZoom(shown)}
                  className="absolute inset-0 hidden place-items-center bg-black/45 text-sm font-extrabold uppercase tracking-[0.12em] text-white lg:grid"
                >
                  +{hidden} fotos
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {discount > 0 && (
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-volt px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink">
          -{discount}%
        </span>
      )}
      {slides.length > 1 && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tabular-nums lg:hidden"
        >
          {Math.min(current, slides.length - 1) + 1} / {slides.length}
        </p>
      )}
    </div>
  );
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
  const preview = useMemo(() => variant ?? previewVariant(product, selection), [product, selection, variant]);
  const slides = useMemo(() => buildSlides(product, preview), [product, preview]);
  const photos = useMemo(() => slides.flatMap((slide) => (slide.image ? [slide.image] : [])), [slides]);
  // Trocar de cor recomeça a galeria pela foto daquela cor (o carrossel do celular volta ao início).
  const galleryKey = slides[0]?.image?.url ?? preview?.art?.colorway ?? "galeria";

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
      {/* Galeria */}
      <div>
        <Gallery key={galleryKey} slides={slides} title={product.title} discount={discount} onZoom={setZoom} />
      </div>

      {/* Informações e compra: fica parada ao lado da grade de fotos no desktop */}
      <div className="lg:sticky lg:top-24 lg:self-start">
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

      {zoom !== null && photos.length > 0 && (
        <Lightbox
          images={photos}
          index={Math.min(zoom, photos.length - 1)}
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
