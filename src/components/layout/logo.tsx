import Link from "next/link";
import { site } from "@/config/site";
import { BoltIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — página inicial`}
      className={cn(
        "inline-flex items-center gap-1.5 text-[1.55rem] font-extrabold leading-none tracking-[-0.04em]",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
    >
      <BoltIcon className="size-[1.15em] -rotate-6 text-volt" />
      <span>{site.name}</span>
    </Link>
  );
}
