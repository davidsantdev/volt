import { Garment } from "@/components/art/garment";
import { Logo } from "@/components/layout/logo";
import { InstagramIcon } from "@/components/ui/icons";
import { site } from "@/config/site";

/**
 * Linhas finas que ligam os cantos da página aos cantos do cartão central
 * (hexágono do layout de referência). Só aparece a partir de md.
 */
function Funnel({ side }: { side: "top" | "bottom" }) {
  const top = side === "top";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 380 56"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-[-140%] hidden h-14 w-[380%] md:block ${top ? "-top-14" : "-bottom-14"}`}
    >
      <g stroke="#5ce52e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none">
        <path d={top ? "M0 .75H380" : "M0 55.25H380"} vectorEffect="non-scaling-stroke" />
        <path d={top ? "M0 .75 140 56" : "M0 55.25 140 0"} vectorEffect="non-scaling-stroke" />
        <path d={top ? "M380 .75 240 56" : "M380 55.25 240 0"} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function Craft() {
  return (
    <section aria-labelledby="craft-title" className="overflow-x-clip py-10 sm:py-20">
      <div className="container-page">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:my-14 md:grid-cols-[1fr_26%_1fr] md:gap-x-10">
          <div className="md:self-start md:pt-2">
            <h2
              id="craft-title"
              className="max-w-[17rem] text-lg font-extrabold uppercase leading-snug tracking-[-0.01em] sm:text-xl"
            >
              Roupas de treino feitas para o seu ritmo
            </h2>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-soft">
              Tecidos leves e respiráveis, costuras planas que não marcam e modelagens que acompanham o corpo em
              movimento. Cada peça é pensada para você esquecer a roupa e focar no treino.
            </p>
          </div>

          <div className="relative mx-auto w-[min(74vw,20rem)] md:w-full">
            <Funnel side="top" />
            <Funnel side="bottom" />
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-ink">
              <div className="absolute -left-[20%] top-[8%] size-[110%] rounded-full bg-volt/20" />
              <Garment
                kind="leggings"
                colorway="volt"
                shadow={false}
                className="absolute inset-x-[4%] top-[6%] h-[78%] drop-shadow-[0_20px_24px_rgba(0,0,0,0.5)]"
              />
              <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
                <InstagramIcon className="size-4" />
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-10">
                <Logo tone="light" className="text-lg" />
              </div>
            </div>
          </div>

          <div className="md:self-end md:pb-2">
            <h3 className="text-lg font-extrabold uppercase leading-snug tracking-[-0.01em] sm:text-xl">
              Conforto testado
            </h3>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-soft">
              Da primeira série ao último alongamento, a {site.name} existe para a sua roupa nunca ser o motivo de
              parar. Peças que secam rápido, não apertam e mantêm o caimento treino após treino.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
