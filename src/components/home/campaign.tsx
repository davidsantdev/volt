import { Garment } from "@/components/art/garment";
import { ButtonLink } from "@/components/ui/button";
import { getSpecialLinks } from "@/lib/shop";

export async function Campaign() {
  const { newHref } = await getSpecialLinks();
  return (
    <section aria-labelledby="campanha-title" className="container-page py-16 sm:py-24">
      <div className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-ink p-6 text-white sm:min-h-[30rem] sm:p-12">
        <svg aria-hidden="true" className="absolute inset-0 -z-10 size-full" preserveAspectRatio="none">
          <defs>
            <pattern
              id="campaign-stripes"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="36" stroke="#5ce52e" strokeOpacity=".22" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#campaign-stripes)" />
        </svg>

        {/* Peça sobre o disco neon: em cima no celular, à direita no desktop. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[56%] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[52%]"
        >
          <div className="absolute left-1/2 top-1/2 aspect-square h-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt sm:left-auto sm:right-[3%] sm:translate-x-0" />
          <Garment
            kind="tank"
            colorway="black"
            shadow={false}
            className="absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] drop-shadow-[0_26px_26px_rgba(0,0,0,0.4)] sm:left-auto sm:right-[16%] sm:translate-x-0"
          />
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="campanha-title"
            className="text-[clamp(2rem,5.2vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
          >
            Seja constante.
            <br />
            Seja intenso.
          </h2>
          <ButtonLink
            href={newHref}
            variant="white"
            size="lg"
            className="self-start sm:self-auto"
          >
            Ver lançamentos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
