import { BoltIcon } from "@/components/ui/icons";

const words = ["Treine forte", "Respire", "Repita", "Sem limites", "Conforto de verdade"];

/** Faixa em movimento puramente decorativa (some do leitor de tela). */
export function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center gap-8 pr-8">
      {words.map((word) => (
        <li key={word} className="flex items-center gap-8 whitespace-nowrap">
          <span className="text-sm font-extrabold uppercase tracking-[0.22em] text-white sm:text-base">{word}</span>
          <BoltIcon className="size-4 text-volt" />
        </li>
      ))}
    </ul>
  );

  return (
    <div aria-hidden="true" className="overflow-hidden bg-ink py-4">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
