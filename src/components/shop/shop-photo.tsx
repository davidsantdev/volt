import Image from "next/image";
import { Garment } from "@/components/art/garment";
import type { Photo } from "@/lib/shop";
import { cn } from "@/lib/utils";

const artTones = ["bg-volt", "bg-mist", "bg-lime", "bg-ink"] as const;

/**
 * Foto de vitrine (topo, categorias, faixas) cobrindo o espaço do pai, que precisa ser `relative`.
 * No modo demonstração mostra a ilustração do produto sobre um fundo de cor.
 */
export function ShopPhoto({
  photo,
  sizes,
  priority = false,
  tone = 0,
  alt,
  className,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  /** Índice da cor de fundo da ilustração (modo demonstração). */
  tone?: number;
  /** "" quando a foto está num link que já diz o mesmo em texto (ex.: o nome da categoria). */
  alt?: string;
  className?: string;
}) {
  if (photo.image) {
    return (
      <Image
        src={photo.image.url}
        alt={alt ?? photo.alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("object-cover object-top", className)}
      />
    );
  }
  if (photo.art) {
    return (
      <div className={cn("absolute inset-0 grid place-items-center", artTones[tone % artTones.length])}>
        <Garment
          kind={photo.art.kind}
          colorway={photo.art.colorway}
          shadow={false}
          className={cn("h-[70%] w-[78%] drop-shadow-[0_22px_24px_rgba(13,15,12,0.35)]", className)}
        />
      </div>
    );
  }
  return null;
}
