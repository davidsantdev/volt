import Link from "next/link";
import { CartButton } from "@/components/layout/cart-button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CategoryTileLink } from "@/components/shop/category-tile";
import { UserIcon } from "@/components/ui/icons";
import { getCategoryTiles, getMenu } from "@/lib/shop";

const accountUrl = process.env.NEXT_PUBLIC_ACCOUNT_URL;

export async function Header() {
  const [menu, tiles] = await Promise.all([getMenu(), getCategoryTiles()]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur-md">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[4.5rem]">
        <div className="flex items-center gap-2">
          <MobileNav
            items={menu}
            categories={
              tiles.length > 0 && (
                <section aria-labelledby="menu-categorias" className="pb-6 pt-7">
                  <h2 id="menu-categorias" className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                    Compre por categoria
                  </h2>
                  <ul className="grid grid-cols-3 gap-2">
                    {tiles.map((tile, index) => (
                      <li key={tile.handle}>
                        <CategoryTileLink tile={tile} index={index} size="sm" sizes="9rem" />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            }
          />
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {menu.map((item) => (
                <li key={item.href + item.title}>
                  <Link
                    href={item.href}
                    className="text-[11px] font-bold uppercase tracking-[0.16em] underline-offset-[10px] decoration-2 decoration-volt transition-colors hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-2">
          <SearchDialog />
          {accountUrl ? (
            <a
              href={accountUrl}
              className="hidden h-11 items-center gap-2 rounded-full border border-ink px-5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-white lg:inline-flex"
            >
              <UserIcon className="size-4" />
              Entrar
            </a>
          ) : null}
          <CartButton />
        </div>
      </div>
    </header>
  );
}
