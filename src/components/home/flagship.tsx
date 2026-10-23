import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { merch } from "@/config/merch";
import { getProduct } from "@/lib/shop";
import { formatMoney, moneyFrom } from "@/lib/utils";

/**
 * Faixa do carro-chefe (merch.flagship) logo abaixo do topo da home: duas fotos, preço e o botão que leva à página
 * do produto (a mesma dos anúncios). Some se o produto não existir na loja.
 */
export async function Flagship() {
  const { flagship } = merch;
  const product = await getProduct(flagship.product);
  if (!product || !product.availableForSale) return null;
  const photos = product.images.slice(0, 2);
  const kit = flagship.bundles[0];
  const kitTotal = kit
    ? moneyFrom(Math.max(Number(product.price.amount) * kit.quantity - kit.off, 0), product.price.currencyCode)
    : null;
  const href = `/produtos/${product.handle}`;

  return (
    <section aria-labelledby="carro-chefe" className="container-page pt-10 sm:pt-16">
      <div className="grid overflow-hidden rounded-card bg-mist md:grid-cols-[1.2fr_1fr]">
        <div className="grid grid-cols-2 gap-1">
          {photos.map((image, index) => (
            <div key={image.url} className="relative aspect-[3/4] md:aspect-auto md:min-h-[30rem]">
              <Image
                src={image.url}
                alt={index === 0 ? product.title : ""}
                fill
                sizes="(min-width: 768px) 27vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 lg:p-14">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            <span aria-hidden="true" className="h-0.5 w-6 bg-volt" />
            {flagship.eyebrow}
          </p>
          <h2 id="carro-chefe" className="font-display text-[clamp(2.6rem,5vw,4rem)] font-extrabold uppercase leading-[0.9]">
            {flagship.title}
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">{flagship.text}</p>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-extrabold tabular-nums">{formatMoney(product.price)}</span>
            {kit && kitTotal && (
              <span className="text-sm text-ink-soft">
                ou <strong className="font-extrabold text-ink">{kit.quantity} por {formatMoney(kitTotal)}</strong>
              </span>
            )}
          </p>
          <ButtonLink href={href} size="lg" className="mt-2 self-start">
            {flagship.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
