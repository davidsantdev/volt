import { JsonLd } from "@/components/seo/json-ld";
import { PlusIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";
import { site } from "@/config/site";

const faqs = [
  {
    question: "Como escolho o tamanho certo?",
    answer:
      "Confira as medidas na descrição de cada produto. Se ficar em dúvida entre dois tamanhos, fale com a gente pelo WhatsApp que ajudamos você a escolher.",
  },
  {
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo estimado e o valor do frete aparecem no checkout, antes de você pagar. Quando o pedido é enviado, você recebe o código de rastreio por e-mail.",
  },
  {
    question: "Posso trocar ou devolver?",
    answer:
      "Sim. Você pode desistir da compra em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor. Para trocas de tamanho, é só falar com a nossa equipe.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: `As opções disponíveis aparecem no checkout, com Pix e cartão de crédito.${
      site.pixDiscount ? ` Pagando no Pix você tem ${Math.round(site.pixDiscount * 100)}% de desconto.` : ""
    }`,
  },
  {
    question: "Como cuidar das minhas roupas de academia?",
    answer:
      "Lave com água fria, em ciclo delicado, sem alvejante e sem amaciante (ele prejudica a elasticidade e a secagem do tecido). Seque à sombra para manter o caimento e as cores por mais tempo.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="container-page pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Dúvidas frequentes</p>
          <h2 id="faq-title" className="mt-3 text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.035em] sm:text-5xl">
            Tudo que você precisa saber
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            Não achou o que procurava? Nossa equipe responde rapidinho.
          </p>
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "outline", className: "mt-6" })}
          >
            <WhatsAppIcon className="size-4" /> Falar no WhatsApp
          </a>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map(({ question, answer }) => (
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
      </div>
      <JsonLd data={faqJsonLd} />
    </section>
  );
}
