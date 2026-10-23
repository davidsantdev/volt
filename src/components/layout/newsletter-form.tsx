"use client";

import { useActionState } from "react";
import { subscribeAction, type NewsletterState } from "@/app/actions/newsletter";
import { ArrowRightIcon } from "@/components/ui/icons";

const initial: NewsletterState = { status: "idle", message: "" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeAction, initial);

  return (
    <form action={action} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Seu e-mail
      </label>
      <div className="flex h-12 items-center rounded-full border border-ink bg-white/60 pl-5 pr-1.5 transition-colors focus-within:bg-white">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Seu melhor e-mail"
          aria-describedby="newsletter-feedback"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/55 focus-visible:shadow-none"
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
          className="grid size-9 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-volt hover:text-ink disabled:opacity-60"
        >
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
      <p
        id="newsletter-feedback"
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-xs font-semibold ${state.status === "error" ? "text-red-800" : "text-ink"}`}
      >
        {state.message}
      </p>
      {state.status !== "success" && (
        <p className="text-[11px] leading-relaxed text-ink/70">
          Ao se inscrever, você aceita receber e-mails promocionais. Cancele quando quiser.
        </p>
      )}
    </form>
  );
}
