import type { ReactNode } from "react";
import { PlusIcon, RefreshIcon, TagIcon, TruckIcon, WindIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { formatAmount, quantityDiscountLabel } from "@/lib/promos";
import type { Product } from "@/lib/shop/types";

export function ProductHeader({ product }: { product: Product }) {
  // Não usa o "tipo de produto": fornecedores de dropshipping mandam categorias em inglês
  // (e até marcas, como "Spanx"). A coleção é sempre um nome que você controla.
  const kind = product.collections[0]?.title;
  return (
    <>
      {kind && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{kind}</p>}
      <h1 className="mt-2 font-display text-[2.15rem] font-extrabold uppercase leading-[0.95] sm:text-[2.6rem]">
        {product.title}
      </h1>
    </>
  );
}

export function ProductBenefits() {
  const bundle = quantityDiscountLabel();
  const items = [
    ...(bundle ? [{ Icon: TagIcon, text: `${bundle}: o desconto entra sozinho no carrinho` }] : []),
    site.freeShippingThreshold
      ? { Icon: TruckIcon, text: `Frete grátis em compras acima de ${formatAmount(site.freeShippingThreshold)}` }
      : { Icon: TruckIcon, text: "Calcule o frete pelo CEP no carrinho" },
    { Icon: RefreshIcon, text: "7 dias para desistir da compra" },
    { Icon: WindIcon, text: "Peça escolhida para treinar com conforto" },
  ];
  return (
    <ul className="mt-6 divide-y divide-line rounded-card border border-line">
      {items.map(({ Icon, text }) => (
        <li key={text} className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold">
          <Icon className="size-5 shrink-0" />
          {text}
        </li>
      ))}
    </ul>
  );
}

function Disclosure({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} className="group border-b border-line">
      <summary className="flex items-center justify-between gap-4 py-5 text-xs font-extrabold uppercase tracking-[0.14em]">
        {title}
        <span className="relative grid size-7 shrink-0 place-items-center rounded-full border border-ink transition-colors group-open:bg-ink group-open:text-white">
          <PlusIcon className="size-3.5" />
          <span aria-hidden="true" className="plus-v absolute h-3 w-[1.8px] bg-current transition-transform" />
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="mt-8 border-t border-line">
      <Disclosure title="Descrição" defaultOpen>
        {product.descriptionHtml ? (
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>
        )}
      </Disclosure>
      <Disclosure title="Entrega e trocas">
        <div className="rich-text">
          <p>
            Calcule o frete pelo CEP no carrinho. O valor e o prazo finais aparecem no checkout, antes de você pagar, e o
            código de rastreio chega por e-mail quando o pedido é enviado.
          </p>
          <p>
            Você pode desistir da compra em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.
            Para trocas, fale com a nossa equipe.
          </p>
        </div>
      </Disclosure>
      <Disclosure title="Cuidados com a peça">
        <div className="rich-text">
          <p>
            Lave com água fria, em ciclo delicado, sem alvejante e sem amaciante. Seque à sombra para manter o caimento
            e as cores por mais tempo.
          </p>
        </div>
      </Disclosure>
    </div>
  );
}
