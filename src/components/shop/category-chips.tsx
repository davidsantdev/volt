import Link from "next/link";
import { site } from "@/config/site";
import { getCollections } from "@/lib/shop";
import { cn } from "@/lib/utils";

/** Atalhos para as categorias no topo das listas (rolam de lado no celular). `current` = handle aberto. */
export async function CategoryChips({ current }: { current: string | null }) {
  const collections = (await getCollections()).filter(
    (collection) => !site.collections.hidden.includes(collection.handle),
  );
  if (collections.length === 0) return null;
  const items = [{ href: "/produtos", title: "Tudo", active: current === null }].concat(
    collections.map((collection) => ({
      href: `/colecoes/${collection.handle}`,
      title: collection.title,
      active: collection.handle === current,
    })),
  );

  return (
    <nav aria-label="Categorias" className="mb-6">
      <ul className="rail-bleed hide-scrollbar flex gap-2 overflow-x-auto py-1">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "inline-flex h-10 items-center rounded-full border px-4 text-xs font-bold transition-colors",
                item.active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
