import Link from "next/link";
import { Fragment } from "react";
import { site } from "@/config/site";
import { getCollections } from "@/lib/shop";

const link = "font-semibold text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink";

/**
 * Texto curto no fim da home, como o da Gymshark: explica a loja com as palavras que as pessoas buscam e liga as
 * categorias (links internos ajudam o Google a entender o site). Só cita coleções que existem.
 */
export async function SeoText() {
  const collections = await getCollections();
  const byHandle = new Map(collections.map((collection) => [collection.handle, collection]));
  const audience = site.collections.priority.filter((handle) => byHandle.has(handle));
  const categories = collections.filter(
    (collection) => !site.collections.hidden.includes(collection.handle) && !audience.includes(collection.handle),
  );

  return (
    <section aria-labelledby="sobre-a-loja" className="container-page pb-16 sm:pb-24">
      <div className="max-w-3xl border-t border-line pt-10 text-sm leading-relaxed text-ink-soft">
        <h2 id="sobre-a-loja" className="text-base font-extrabold text-ink">
          Roupas de academia femininas e masculinas
        </h2>
        <p className="mt-3">
          Na {site.name} você encontra roupas de academia para treinar com conforto e estilo
          {audience.length > 0 && (
            <>
              {", nas linhas "}
              {audience.map((handle, index) => (
                <Fragment key={handle}>
                  {index > 0 && " e "}
                  <Link href={`/colecoes/${handle}`} className={link}>
                    {byHandle.get(handle)!.title.toLowerCase()}
                  </Link>
                </Fragment>
              ))}
            </>
          )}
          {categories.length > 0 && (
            <>
              {": "}
              {categories.map((collection, index) => (
                <Fragment key={collection.handle}>
                  {index > 0 && (index === categories.length - 1 ? " e " : ", ")}
                  <Link href={`/colecoes/${collection.handle}`} className={link}>
                    {collection.title.toLowerCase()}
                  </Link>
                </Fragment>
              ))}
            </>
          )}
          . Cada página traz as cores, os tamanhos e as medidas da peça, e o guia de tamanhos ajuda você a escolher
          antes de comprar.
        </p>
        <p className="mt-3">
          Para treinar em casa, na academia ou ao ar livre, combine peças de cima e de baixo ou escolha um conjunto
          pronto. O frete é calculado pelo CEP no carrinho, antes do pagamento, e você tem 7 dias após o recebimento
          para desistir da compra.
        </p>
      </div>
    </section>
  );
}
