"use client";

import { useActionState } from "react";
import { subscribeAction, type NewsletterState } from "@/app/actions/newsletter";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const initial: NewsletterState = { status: "idle", message: "" };

/** `tone="dark"` para usar sobre fundo preto (faixa do rodapé). */
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(subscribeAction, initial);
  const dark = tone === "dark";

  return (
    <form action={action} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Seu e-mail
      </label>
      <div
        className={cn(
          "flex h-12 items-center rounded-full border pl-5 pr-1.5 transition-colors",
          dark
            ? "border-white/35 bg-white/10 text-white focus-within:border-white"
            : "border-ink bg-white/60 focus-within:bg-white",
        )}
      >
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Seu melhor e-mail"
          aria-describedby="newsletter-feedback"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:shadow-none",
            dark ? "placeholder:text-white/55" : "placeholder:text-ink/55",
          )}
        />
        {/* Campo-isca anti-robô: escondido de pessoas e de leitores de tela. */}
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Inscrever na newsletter"
          className={cn(
            "grid size-9 place-items-center rounded-full transition-colors disabled:opacity-60",
            dark ? "bg-volt text-ink hover:bg-white" : "bg-ink text-white hover:bg-volt hover:text-ink",
          )}
        >
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
      <p
        id="newsletter-feedback"
        role="status"
        aria-live="polite"
        className={cn(
          "mt-3 min-h-5 text-xs font-semibold",
          state.status === "error" ? (dark ? "text-red-300" : "text-red-800") : dark ? "text-white" : "text-ink",
        )}
      >
        {state.message}
      </p>
      {state.status !== "success" && (
        <p className={cn("text-[11px] leading-relaxed", dark ? "text-white/60" : "text-ink/70")}>
          Ao se inscrever, você aceita receber e-mails promocionais. Cancele quando quiser.
        </p>
      )}
    </form>
  );
}
