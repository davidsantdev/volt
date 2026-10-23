"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Gaveta sobre <dialog> nativo: foco preso, Esc fecha e leitor de tela entende. */
export function Drawer({
  open,
  onClose,
  label,
  side = "right",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Foca o painel (e não o primeiro botão): evita o anel de foco em "Fechar" a cada abertura.
      dialog.focus({ preventScroll: true });
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      aria-label={label}
      className={cn("drawer", side === "left" && "drawer-left", className)}
      onClose={onClose}
      onClick={(event) => {
        // Clique no fundo escurecido (::backdrop) chega com o próprio <dialog> como alvo.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open ? children : null}
    </dialog>
  );
}
