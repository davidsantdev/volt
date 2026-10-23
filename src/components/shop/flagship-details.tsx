import { JsonLd } from "@/components/seo/json-ld";
import { BoltIcon, PlusIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { merch } from "@/config/merch";

/** Destaques e perguntas do carro-chefe (merch.flagship), abaixo da área de compra da página dele. */
export function FlagshipDetails() {
  const { highlights, faq } = merch.flagship;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      {highlights.length > 0 && (
        <section aria-labelledby="destaques-produto" className="mt-16 sm:mt-24">
          <SectionHeading id="destaques-produto" eyebrow="Por dentro da peça" title="O que ela tem" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ title, text }) => (
              <li key={title} className="rounded-card bg-mist p-5">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-volt">
                  <BoltIcon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold uppercase leading-none">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {faq.length > 0 && (
        <section aria-labelledby="duvidas-produto" className="mt-16 sm:mt-24">
          <SectionHeading id="duvidas-produto" eyebrow="Antes de comprar" title="Dúvidas sobre ela" />
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {faq.map(({ question, answer }) => (
              <details key={question} className="group py-1">
                <summary className="flex items-center justify-between gap-6 py-5 text-left text-sm font-extrabold uppercase tracking-[0.03em] sm:text-base">
                  {question}
                  <span className="relative grid size-8 shrink-0 place-items-center rounded-full border border-ink transition-colors group-open:bg-ink group-open:text-white">
                    <PlusIcon className="size-4" />
                    <span aria-hidden="true" className="plus-v absolute h-3.5 w-[1.8px] origin-center bg-current transition-transform" />
                  </span>
                </summary>
                <p className="max-w-xl pb-6 text-sm leading-relaxed text-ink-soft">{answer}</p>
              </details>
            ))}
          </div>
          <JsonLd data={faqJsonLd} />
        </section>
      )}
    </>
  );
}
