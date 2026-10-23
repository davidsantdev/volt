import Image from "next/image";
import { Garment } from "@/components/art/garment";
import type { ArtSpec, ShopImage } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

/**
 * Foto do produto (Shopify) ou, no modo demonstração, a ilustração vetorial.
 * `blend` faz o fundo branco das fotos de fornecedor "sumir" sobre cards coloridos.
 */
export function ProductImage({
  image,
  art,
  alt,
  sizes,
  priority = false,
  blend = true,
  className,
}: {
  image: ShopImage | null;
  art?: ArtSpec;
  alt: string;
  sizes?: string;
  priority?: boolean;
  blend?: boolean;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image.url}
        alt={image.altText || alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("object-contain", blend && "mix-blend-multiply", className)}
      />
    );
  }
  if (art) {
    return <Garment kind={art.kind} colorway={art.colorway} className={className} />;
  }
  return (
    <div
      className={cn(
        "grid place-items-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted",
        className,
      )}
    >
      Sem imagem
    </div>
  );
}
