"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Carrossel horizontal: arrasta no celular (scroll-snap nativo, sem biblioteca) e tem setas em telas com mouse.
 * Os itens (<li>) definem a própria largura; o conteúdo continua no HTML para o Google.
 */
export function Rail({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const update = () =>
      setEdges({
        start: list.scrollLeft <= 4,
        end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 4,
      });
    update();
    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function go(direction: 1 | -1) {
    const list = ref.current;
    if (list) list.scrollBy({ left: direction * list.clientWidth * 0.85, behavior: "smooth" });
  }

  const arrow =
    "absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_8px_24px_-8px_rgba(13,15,12,0.45)] transition hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-0 [@media(hover:hover)]:grid";

  return (
    <div className="relative">
      <ul
        ref={ref}
        aria-label={label}
        className={cn(
          "rail-bleed hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-5",
          className,
        )}
      >
        {children}
      </ul>
      <button type="button" aria-label="Anteriores" onClick={() => go(-1)} disabled={edges.start} className={`${arrow} -left-3`}>
        <ArrowRightIcon className="size-5 rotate-180" />
      </button>
      <button type="button" aria-label="Próximos" onClick={() => go(1)} disabled={edges.end} className={`${arrow} -right-3`}>
        <ArrowRightIcon className="size-5" />
      </button>
    </div>
  );
}
