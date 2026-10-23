import { CategoryTileLink } from "@/components/shop/category-tile";
import { Rail } from "@/components/ui/rail";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategoryTiles } from "@/lib/shop";

/** Categorias com foto e nome por cima (Oner Active, Gymshark), num carrossel; também são links internos para SEO. */
export async function CategoryTiles() {
  const tiles = await getCategoryTiles();
  if (tiles.length === 0) return null;

  return (
    <section aria-labelledby="categorias" className="container-page py-10 sm:py-16">
      <SectionHeading id="categorias" title="Compre por categoria" href="/colecoes" linkLabel="Ver todas" />
      <Rail label="Categorias">
        {tiles.map((tile, index) => (
          <li key={tile.handle} className="w-[40%] shrink-0 snap-start sm:w-[28%] lg:w-[calc(20%-1rem)]">
            <CategoryTileLink
              tile={tile}
              index={index}
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 28vw, 40vw"
            />
          </li>
        ))}
      </Rail>
    </section>
  );
}
