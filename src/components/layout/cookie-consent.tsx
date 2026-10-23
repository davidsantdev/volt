"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasPixels, startPixels, stopPixels, trackPageView } from "@/lib/analytics";

const KEY = "cookie-consent";
type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** Avisa os pixels a cada troca de página (só depois do "Aceitar"). */
function PageViews() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}

/**
 * Aviso de cookies (LGPD). Os pixels de anúncio (src/lib/analytics.ts) só carregam depois do "Aceitar"; sem
 * nenhum pixel no .env, o aviso nem aparece, porque o site não usa cookies de terceiros.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null | "loading">("loading");

  useEffect(() => {
    if (!hasPixels) return;
    const saved = readChoice();
    if (saved === "granted") startPixels();
    if (saved === "denied") stopPixels();
    // A escolha fica no navegador do visitante (não há como lê-la no servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(saved);
  }, []);

  if (!hasPixels) return null;

  function decide(value: Choice) {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // armazenamento bloqueado (aba anônima): a pergunta volta na próxima visita
    }
    if (value === "granted") startPixels();
    else stopPixels();
    setChoice(value);
  }

  if (choice === "granted") {
    return (
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    );
  }
  if (choice !== null) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-ink p-5 text-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
    >
      <p className="text-[13px] leading-relaxed text-white/85">
        Usamos cookies para medir as visitas e melhorar os nossos anúncios. Saiba mais na{" "}
        <Link href="/paginas/privacidade" className="font-semibold text-white underline underline-offset-2">
          política de privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="volt" onClick={() => decide("granted")}>
          Aceitar
        </Button>
        <Button size="sm" variant="outline-light" onClick={() => decide("denied")}>
          Recusar
        </Button>
      </div>
    </div>
  );
}
