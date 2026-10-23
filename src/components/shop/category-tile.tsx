import Link from "next/link";
import { ShopPhoto } from "@/components/shop/shop-photo";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { CategoryTile } from "@/lib/shop";
import { cn } from "@/lib/utils";

/** Foto vertical da categoria com o nome por cima (home e página de coleções). */
export function CategoryTileLink({
  tile,
  index,
  sizes,
  priority = false,
  size = "md",
}: {
  tile: CategoryTile;
  index: number;
  sizes: string;
  priority?: boolean;
  /** `sm` = miniatura do menu do celular (3 por linha, sem a seta). */
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-mist">
      {tile.photo && (
        <ShopPhoto
          photo={tile.photo}
          alt=""
          tone={index}
          priority={priority}
          sizes={sizes}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      )}
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent text-white",
          size === "lg" ? "p-4 pt-14" : size === "sm" ? "p-2 pt-8" : "p-3 pt-12 sm:p-4 sm:pt-14",
        )}
      >
        <span
          className={cn(
            "font-display font-extrabold uppercase leading-[0.95]",
            size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-base" : "text-xl sm:text-2xl",
          )}
        >
          {tile.title}
        </span>
        {size !== "sm" && (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-volt sm:size-9">
            <ArrowRightIcon className="size-4" />
          </span>
        )}
      </span>
    </Link>
  );
}
