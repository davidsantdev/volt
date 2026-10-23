/**
 * Tudo que é "marca" e "promessa da loja" fica aqui. Campo vazio (ou 0) = o site não mostra.
 * Oferta anunciada obriga a loja a cumprir (CDC, art. 30): só ative o que já está configurado
 * na Shopify ou no gateway de pagamento. Lista completa em README.md → "Antes de vender".
 */

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (productionHost ? `https://${productionHost}` : "http://localhost:3000")
).replace(/\/$/, "");

const warnedGlobal = globalThis as { __siteUrlWarned?: boolean };
if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "production" &&
  (process.env.VERCEL || process.env.CI) &&
  siteUrl.startsWith("http://localhost") &&
  !warnedGlobal.__siteUrlWarned
) {
  // canonical, sitemap e Open Graph usam esta URL: localhost em um deploy estragaria o SEO.
  warnedGlobal.__siteUrlWarned = true;
  console.warn("[seo] NEXT_PUBLIC_SITE_URL não está definida: canonical e sitemap vão usar http://localhost:3000.");
}

export const site = {
  name: "VOLT",
  /** Razão social e CNPJ (ou CPF de MEI): quem vende online deve exibir no site (Decreto 7.962/2013). */
  legalName: "",
  cnpj: "",
  url: siteUrl,
  lang: "pt-BR",
  locale: "pt_BR",
  currency: "BRL",

  /** Imagem de compartilhamento (1200×630) em /public. */
  ogImage: "/og.png",

  title: "VOLT | Roupas de academia com conforto e performance",
  tagline: "Roupas de academia com conforto de verdade",
  description:
    "Tops, shorts, conjuntos, moletons, jaquetas e acessórios de academia, femininos e masculinos. Treine com mais conforto, estilo e liberdade de movimento.",
  keywords: [
    "roupas de academia",
    "roupa de treino",
    "moda fitness",
    "legging academia",
    "top fitness",
    "shorts de treino",
    "regata dry fit",
  ],

  /**
   * Frete grátis a partir deste valor (R$). Antes, crie em Shopify → Configurações → Frete e entrega uma taxa
   * "Frete grátis" com pedido mínimo igual. Em 23/10/2026 a loja cobrava R$ 22 ("Padrão") para SP mesmo
   * num pedido de R$ 319, então fica desligado. 0 = desligado.
   */
  freeShippingThreshold: 0,
  /** Desconto no Pix (0.05 = 5%). Só depois que o gateway (Mercado Pago, Pagar.me…) aplicar o desconto. 0 = desligado. */
  pixDiscount: 0,
  /** Parcelas sem juros que o gateway oferece (ex.: 3). 0 ou 1 = não mostra parcelamento. */
  maxInstallments: 0,
  /** Mensagens da barra do topo além das de frete grátis, Pix e parcelamento (que entram sozinhas quando ativas). */
  announcement: ["Devolução em até 7 dias", "Pagamento seguro pela Shopify"],
  /** Cupom de boas-vindas: crie o código em Shopify → Descontos antes de preencher (ex.: "10% off" / "BEMVINDO10"). */
  newsletter: { discountLabel: "", discountCode: "" },

  contact: {
    email: "",
    /** Só números, com DDI e DDD (ex.: 5511912345678). Vazio = sem botões de WhatsApp. */
    whatsapp: "",
    hours: "Seg a Sex, 9h às 18h",
  },
  /** Endereço completo do perfil (ex.: https://instagram.com/sualoja). */
  social: {
    instagram: "",
    tiktok: "",
    youtube: "",
  },

  /** Handles das coleções especiais (crie com esses nomes na Shopify). */
  collections: {
    best: "mais-vendidos",
    new: "lancamentos",
    /** Coleções que não aparecem como "categoria". */
    hidden: ["mais-vendidos", "lancamentos", "frontpage", "all"],
    /** Aparecem primeiro nas listas de categorias (as demais seguem a ordem da Shopify). */
    priority: ["feminino", "masculino"],
  },

  /**
   * Menu usado quando a Shopify não tem um "main-menu" personalizado.
   * Links para coleções que não existem na loja são omitidos sozinhos (ex.: Masculino, até haver produtos).
   */
  nav: [
    { title: "Loja", href: "/produtos" },
    { title: "Feminino", href: "/colecoes/feminino" },
    { title: "Masculino", href: "/colecoes/masculino" },
    { title: "Lançamentos", href: "/colecoes/lancamentos" },
    { title: "Coleções", href: "/colecoes" },
  ],
  menuHandle: "main-menu",

  /** Páginas institucionais (crie em Shopify > Páginas, com esses handles). */
  pages: [
    { title: "Sobre a VOLT", handle: "sobre" },
    { title: "Entregas e prazos", handle: "entregas" },
    { title: "Trocas e devoluções", handle: "trocas-e-devolucoes" },
    { title: "Política de privacidade", handle: "privacidade" },
    { title: "Termos de uso", handle: "termos" },
  ],
};

export type NavItem = { title: string; href: string };
