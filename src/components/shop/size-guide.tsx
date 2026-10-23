"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { CloseIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";
import { whatsappHref } from "@/lib/promos";

/**
 * Guia de tamanhos ao lado da escolha de tamanho (Baymard: perto do seletor e com "Fechar" claro).
 * Sem tabela de centímetros inventada: as medidas variam por fornecedor. Traz conversão de letras,
 * como medir e a regra prática do padrão asiático.
 */
const conversion = [
  ["XS", "PP"],
  ["S", "P"],
  ["M", "M"],
  ["L", "G"],
  ["XL", "GG"],
  ["XXL / 2XL", "XGG"],
  ["XXXL / 3XL", "XXGG"],
];

const howToMeasure = [
  ["Busto", "Passe a fita métrica na parte mais cheia do peito, sem apertar."],
  ["Cintura", "Meça na parte mais fina do tronco, um pouco acima do umbigo."],
  ["Quadril", "Meça na parte mais larga do quadril, com os pés juntos."],
];

export function SizeGuideButton({ productTitle }: { productTitle: string }) {
  const [open, setOpen] = useState(false);
  const whatsapp = whatsappHref(`Olá! Quero ajuda com o tamanho do produto: ${productTitle}`);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto text-[11px] font-bold normal-case tracking-normal underline underline-offset-4 hover:text-ink-soft"
      >
        Guia de tamanhos
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Guia de tamanhos">
        <div className="flex h-full flex-col">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line px-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.12em]">Guia de tamanhos</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar guia de tamanhos"
              className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-mist"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 text-sm leading-relaxed">
            <section className="rounded-2xl bg-lime/60 p-4">
              <h3 className="font-extrabold uppercase tracking-[0.04em]">Padrão asiático</h3>
              <p className="mt-1 text-ink-soft">
                Nossas peças seguem a numeração asiática e costumam vestir <strong>um número menor</strong> que a
                brasileira. Em dúvida entre dois tamanhos, escolha o maior. As medidas exatas de cada peça, quando o
                fabricante informa, estão nas fotos e na descrição do produto.
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em]">Equivalência de letras</h3>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink text-[11px] uppercase tracking-[0.12em]">
                    <th scope="col" className="py-2 font-bold">Na etiqueta</th>
                    <th scope="col" className="py-2 font-bold">Equivale a (Brasil)</th>
                  </tr>
                </thead>
                <tbody>
                  {conversion.map(([international, brazil]) => (
                    <tr key={international} className="border-b border-line">
                      <td className="py-2.5 font-bold">{international}</td>
                      <td className="py-2.5">{brazil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em]">Como se medir</h3>
              <dl className="space-y-3">
                {howToMeasure.map(([part, tip]) => (
                  <div key={part}>
                    <dt className="font-bold">{part}</dt>
                    <dd className="text-ink-soft">{tip}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-ink-soft">
                Compare com uma peça sua que veste bem: meça-a esticada sobre a mesa e escolha o tamanho mais próximo.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em]">Não serviu?</h3>
              <p className="text-ink-soft">
                Você pode desistir da compra em até 7 dias após o recebimento, conforme o Código de Defesa do
                Consumidor.
              </p>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ variant: "outline", className: "mt-4" })}
                >
                  <WhatsAppIcon className="size-4" /> Tirar dúvida no WhatsApp
                </a>
              )}
            </section>
          </div>
        </div>
      </Drawer>
    </>
  );
}
