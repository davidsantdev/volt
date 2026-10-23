"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled,
  label = "Quantidade",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const button =
    "grid size-9 place-items-center rounded-full text-base transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-40";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-line bg-white", className)}
    >
      <button
        type="button"
        className={button}
        aria-label="Diminuir quantidade"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon />
      </button>
      <output className="min-w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={button}
        aria-label="Aumentar quantidade"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
