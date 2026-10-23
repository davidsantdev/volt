"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { suggestAction, type Suggestion } from "@/app/actions/search";
import { Drawer } from "@/components/ui/drawer";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/utils";

/**
 * Busca instantânea do cabeçalho: sugestões enquanto digita (como nas grandes lojas) e "ver todos"
 * levando à página /busca. Sem JavaScript, o ícone continua sendo um link para /busca.
 */
export function SearchDialog() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<{ term: string; items: Suggestion[] } | null>(null);
  const [pending, startTransition] = useTransition();
  const query = term.trim();
  const items = results?.term === query ? results.items : [];

  useEffect(() => {
    if (query.length < 2) return;
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const found = await suggestAction(query);
        setResults({ term: query, items: found });
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  // A gaveta foca o próprio painel ao abrir; aqui o foco vai para o campo (efeito do pai roda depois).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query) return;
    close();
    router.push(`/busca?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <Link
        href="/busca"
        aria-label="Buscar produtos"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-mist"
      >
        <SearchIcon className="size-[22px]" />
      </Link>
      <Drawer open={open} onClose={close} label="Buscar produtos">
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line px-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.12em]">Buscar</h2>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar busca"
              className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={submit} role="search" className="border-b border-line p-5">
            <label htmlFor="busca-instantanea" className="sr-only">
              O que você procura?
            </label>
            <div className="flex items-center gap-2 rounded-full border border-ink px-4">
              <SearchIcon className="size-5 shrink-0" />
              <input
                ref={inputRef}
                id="busca-instantanea"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Regata, short, conjunto…"
                autoComplete="off"
                maxLength={60}
                className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
          </form>

          <div className="flex-1 overflow-y-auto px-5 py-4" aria-live="polite">
            {query.length < 2 ? (
              <p className="text-sm text-muted">Digite pelo menos 2 letras.</p>
            ) : items.length > 0 ? (
              <>
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.handle}>
                      <Link href={`/produtos/${item.handle}`} onClick={close} className="flex items-center gap-4 py-3 hover:opacity-80">
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                          {item.image && (
                            <Image src={item.image.url} alt="" fill sizes="64px" className="object-cover" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-extrabold uppercase leading-snug tracking-[0.04em]">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-sm font-bold tabular-nums">{formatMoney(item.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/busca?q=${encodeURIComponent(query)}`}
                  onClick={close}
                  className="mt-4 inline-block text-xs font-bold underline underline-offset-4"
                >
                  Ver todos os resultados para “{query}”
                </Link>
              </>
            ) : pending || results?.term !== query ? (
              <p className="text-sm text-muted">Buscando…</p>
            ) : (
              <p className="text-sm text-muted">Nada encontrado para “{query}”. Tente outra palavra.</p>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
