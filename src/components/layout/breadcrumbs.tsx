import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/utils";

export type Crumb = { name: string; href: string };

/** Migalhas visíveis + BreadcrumbList (rich result do Google). O último item é a página atual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <nav aria-label="Navegação estrutural" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
