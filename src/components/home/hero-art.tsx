import { Garment } from "@/components/art/garment";
import { BoltIcon } from "@/components/ui/icons";

/** Selo giratório. O texto é decorativo, por isso fica fora da árvore de acessibilidade. */
function SpinBadge({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="hero-badge-ring" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="#0d0f0c" />
        <text fill="#d7ff3d" fontSize="9.6" fontWeight="800">
          <textPath href="#hero-badge-ring" textLength="276" lengthAdjust="spacing">
            SECAGEM RÁPIDA • TOQUE MACIO •
          </textPath>
        </text>
      </svg>
      <BoltIcon className="absolute inset-0 m-auto size-[34%] text-volt" />
    </div>
  );
}

/**
 * Peça em destaque sobre o disco neon. Para usar uma foto real, troque o
 * <Garment /> por <Image /> com um PNG recortado (fundo transparente).
 */
export function HeroArt() {
  return (
    <div className="relative aspect-square w-full" aria-hidden="true">
      <div className="absolute inset-[3%] rounded-full bg-volt" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <circle cx="200" cy="200" r="168" fill="none" stroke="#0d0f0c" strokeOpacity=".14" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="128" fill="none" stroke="#0d0f0c" strokeOpacity=".1" strokeWidth="1.5" />
      </svg>
      <Garment
        kind="hoodie"
        colorway="black"
        shadow={false}
        className="absolute inset-[1%] size-[98%] animate-float drop-shadow-[0_28px_28px_rgba(13,15,12,0.35)]"
      />
      <SpinBadge className="absolute -right-2 top-0 size-[27%] sm:-right-5" />
    </div>
  );
}
