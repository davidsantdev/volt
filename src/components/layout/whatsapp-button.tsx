import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/promos";

/** Botão flutuante de atendimento (padrão no varejo brasileiro). Só aparece com o número configurado em site.ts. */
export function WhatsAppButton() {
  const href = whatsappHref("Olá! Vim pelo site e tenho uma dúvida.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-24 right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
