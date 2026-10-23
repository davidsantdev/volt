import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/shop";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Coleções de roupas de academia",
  description:
    "Explore as coleções: feminino, masculino, leggings, shorts, regatas, tops, moletons e acessórios para treinar com conforto.",
  path: "/colecoes",
});

const tones = ["bg-mist", "bg-volt", "bg-white border border-line", "bg-lime", "bg-ink text-white"];

export default async function CollectionsPage() {
  const collections = await getCollections();
  const visible = collections.filter((collection) => !site.collections.hidden.includes(collection.handle));
  const special = collections.filter((collection) => site.collections.hidden.includes(collection.handle));
  const list = [...special.filter((c) => c.handle !== "frontpage" && c.handle !== "all"), ...visible];

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { name: "Início", href: "/" },
          { name: "Coleções", href: "/colecoes" },
        ]}
      />
      <header className="mb-10 mt-6 max-w-2xl">
        <h1 className="text-4xl font-extrabold uppercase leading-[1] tracking-[-0.04em] sm:text-6xl">Coleções</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Encontre a peça certa para o seu treino, do aquecimento ao alongamento.
        </p>
      </header>

      {list.length === 0 ? (
        <p className="rounded-card bg-mist p-10 text-center text-sm text-ink-soft">
          Nenhuma coleção publicada ainda.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((collection, index) => (
            <li key={collection.handle}>
              <Link
                href={`/colecoes/${collection.handle}`}
                className={cn(
                  "group flex min-h-48 flex-col justify-between rounded-card p-6 transition-transform duration-300 hover:-translate-y-1",
                  tones[index % tones.length],
                )}
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-2xl font-extrabold uppercase leading-tight tracking-[-0.03em]">
                    {collection.title}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors group-hover:bg-volt group-hover:text-ink">
                    <ArrowUpRightIcon className="size-5" />
                  </span>
                </span>
                {collection.description && (
                  <span className="mt-6 line-clamp-2 max-w-xs text-[13px] leading-relaxed opacity-80">
                    {collection.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
