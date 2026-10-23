import { RefreshIcon, TagIcon, TruckIcon, WindIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { formatAmount } from "@/lib/promos";

export function TrustStrip() {
  const items = [
    ...(site.freeShippingThreshold
      ? [
          {
            Icon: TruckIcon,
            title: "Frete grátis",
            text: `Em compras acima de ${formatAmount(site.freeShippingThreshold)}`,
          },
        ]
      : [{ Icon: TruckIcon, title: "Frete pelo CEP", text: "Calcule no carrinho, antes de pagar" }]),
    { Icon: RefreshIcon, title: "Compra tranquila", text: "7 dias para desistir, como manda a lei" },
    ...(site.pixDiscount
      ? [
          {
            Icon: TagIcon,
            title: `${Math.round(site.pixDiscount * 100)}% off no Pix`,
            text: "Desconto aplicado no pagamento",
          },
        ]
      : [{ Icon: TagIcon, title: "Pagamento seguro", text: "Checkout oficial da Shopify" }]),
    { Icon: WindIcon, title: "Conforto em primeiro lugar", text: "Peças escolhidas para treinar com liberdade" },
  ];

  return (
    <section aria-label="Vantagens" className="border-b border-line bg-mist">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-5 py-5 sm:py-6 lg:grid-cols-4 lg:gap-x-8">
        {items.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] sm:text-xs">{title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
