"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page grid min-h-[60vh] place-content-center justify-items-center gap-6 py-20 text-center">
      <h1 className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.92] sm:text-6xl">Algo saiu do eixo</h1>
      <p className="max-w-md text-[15px] text-ink-soft">
        Tivemos um problema para carregar esta página. Tente de novo em instantes.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          Tentar de novo
        </Button>
        <ButtonLink href="/" variant="outline" size="lg">
          Página inicial
        </ButtonLink>
      </div>
    </div>
  );
}
