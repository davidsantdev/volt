import { RefreshIcon, TagIcon, TruckIcon, WindIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { formatMoney, moneyFrom } from "@/lib/utils";

export function TrustStrip() {
  const items = [
    ...(site.freeShippingThreshold
      ? [
          {
            Icon: TruckIcon,
            title: "Frete grátis",
            text: `Em compras acima de ${formatMoney(moneyFrom(site.freeShippingThreshold, site.currency)).replace(",00", "")}`,
          },
        ]
      : []),
    { Icon: RefreshIcon, title: "Compra tranquila", text: "7 dias para desistir, como manda a lei" },
    ...(site.pixDiscount
      ? [
          {
            Icon: TagIcon,
            title: `${Math.round(site.pixDiscount * 100)}% off no Pix`,
            text: "Desconto aplicado no pagamento",
          },
        ]
      : []),
    { Icon: WindIcon, title: "Conforto em primeiro lugar", text: "Tecidos leves, respiráveis e sem atrito" },
  ];

  return (
    <section aria-label="Vantagens" className="container-page">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <li
            key={title}
            className="flex flex-col items-start gap-3 bg-white p-4 sm:flex-row sm:items-center sm:gap-3.5 sm:p-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-volt/25 text-ink">
              <Icon className="size-[22px]" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.06em]">{title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
