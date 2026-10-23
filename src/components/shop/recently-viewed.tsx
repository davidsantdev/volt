"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Money, ShopImage } from "@/lib/shop/types";
import { formatMoney } from "@/lib/utils";

type Seen = { handle: string; title: string; price: Money; image: ShopImage | null };

const KEY = "volt-recent-v1";
const MAX = 12;

function read(): Seen[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? (parsed as Seen[]).filter((item) => item && typeof item.handle === "string") : [];
  } catch {
    return [];
  }
}

/**
 * "Vistos recentemente": guarda no navegador do cliente (nada vai para servidor) os últimos produtos
 * abertos e mostra os outros na página de produto, como fazem as lojas grandes.
 */
export function RecentlyViewed({ current }: { current: Seen }) {
  const [items, setItems] = useState<Seen[]>([]);

  useEffect(() => {
    const previous = read().filter((item) => item.handle !== current.handle);
    try {
      window.localStorage.setItem(KEY, JSON.stringify([current, ...previous].slice(0, MAX)));
    } catch {
      // armazenamento bloqueado (aba anônima): só não lembra
    }
    // Lê o armazenamento uma vez ao abrir a página (não há como ler isso no servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(previous.slice(0, 4));
  }, [current]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="vistos" className="mt-20 sm:mt-28">
      <SectionHeading id="vistos" title="Vistos recentemente" />
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.handle}>
            <Link href={`/produtos/${item.handle}`} className="group block">
              <span className="relative block aspect-square overflow-hidden rounded-card bg-mist">
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}
              </span>
              <span className="mt-3 line-clamp-2 text-[13px] font-semibold leading-snug sm:text-sm">
                {item.title}
              </span>
              <span className="mt-1 block text-sm font-bold tabular-nums">{formatMoney(item.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
