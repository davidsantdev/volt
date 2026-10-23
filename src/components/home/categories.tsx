import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { getCollections } from "@/lib/shop";

/** Tabela de categorias (no lugar dos "parceiros" do layout) + links internos para SEO. */
export async function Categories() {
  const collections = (await getCollections())
    .filter((collection) => !site.collections.hidden.includes(collection.handle))
    .slice(0, 12);
  if (collections.length === 0) return null;

  // Completa a última linha com células vazias para a grade (que usa gap-px) fechar certinho.
  const fillers = (4 - (collections.length % 4)) % 4;

  return (
    <section aria-labelledby="categorias" className="container-page pb-16 sm:pb-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id="categorias" className="text-2xl font-extrabold uppercase tracking-[-0.03em] sm:text-3xl">
          Compre por categoria
        </h2>
        <Link
          href="/colecoes"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] underline-offset-4 hover:underline"
        >
          Ver todas <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-ink bg-ink md:grid-cols-4">
        {collections.map((collection) => (
          <li key={collection.handle} className="bg-white">
            <Link
              href={`/colecoes/${collection.handle}`}
              className="group flex h-28 flex-col items-center justify-center gap-2 px-3 text-center transition-colors hover:bg-lime sm:h-32"
            >
              <span className="text-sm font-extrabold uppercase tracking-[0.04em] sm:text-base">
                {collection.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-ink">
                Ver coleção <ArrowRightIcon className="size-3" />
              </span>
            </Link>
          </li>
        ))}
        {Array.from({ length: fillers }, (_, index) => (
          <li key={`filler-${index}`} aria-hidden="true" className="hidden bg-white md:block" />
        ))}
      </ul>
    </section>
  );
}
