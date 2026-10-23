import { HeroArt } from "@/components/home/hero-art";
import { ButtonLink } from "@/components/ui/button";
import { getSpecialLinks } from "@/lib/shop";

/** X de linhas finas atrás do título, como no layout de referência. */
function HeroLines() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden size-full md:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="2" y1="0" x2="98" y2="100" stroke="#5ce52e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1="98" y1="0" x2="2" y2="100" stroke="#5ce52e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const sideWord =
  "row-start-2 text-[clamp(1.5rem,4.6vw,4.8rem)] font-extrabold uppercase leading-none tracking-[-0.045em] text-volt md:row-start-1";

export async function Hero() {
  const { newHref } = await getSpecialLinks();
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <HeroLines />
      <div className="container-page flex flex-col items-center pb-14 pt-9 text-center sm:pt-12 lg:pb-20">
        <h1
          id="hero-title"
          className="font-extrabold uppercase leading-[0.86] tracking-[-0.05em] text-ink"
        >
          <span className="mb-2 block text-[clamp(0.78rem,1.5vw,1.1rem)] font-bold tracking-[0.5em] sm:mb-3">
            Roupas de
          </span>
          <span className="block text-[clamp(3.4rem,13.2vw,10.5rem)]">Academia</span>
        </h1>

        <div className="mt-3 grid w-full max-w-5xl grid-cols-2 items-center gap-x-4 gap-y-5 md:mt-1 md:grid-cols-[1fr_auto_1fr] md:gap-x-4 lg:gap-x-8">
          <div className="col-span-2 row-start-1 mx-auto w-[min(74vw,21rem)] md:col-span-1 md:col-start-2 md:w-[clamp(15rem,30vw,25rem)]">
            <HeroArt />
          </div>
          <span aria-hidden="true" className={`${sideWord} justify-self-end md:col-start-1`}>
            Treino
          </span>
          <span aria-hidden="true" className={`${sideWord} justify-self-start md:col-start-3`}>
            Conforto
          </span>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-soft sm:text-base">
          Tops, shorts, conjuntos, moletons e acessórios escolhidos para acompanhar cada repetição, com modelagens que
          dão liberdade de movimento.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/produtos" size="lg">
            Comprar agora
          </ButtonLink>
          <ButtonLink href={newHref} variant="outline" size="lg">
            Ver lançamentos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
