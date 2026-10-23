import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Título de seção da home (e de listas), com link "Ver todos" opcional à direita. */
export function SectionHeading({
  id,
  title,
  eyebrow,
  href,
  linkLabel = "Ver todos",
  className,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  href?: string | null;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4 sm:mb-8", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{eyebrow}</p>}
        <h2 id={id} className="font-display text-[2rem] font-extrabold uppercase leading-[0.95] sm:text-[2.6rem]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] underline decoration-1 underline-offset-[6px] transition hover:decoration-2"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
