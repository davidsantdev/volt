/**
 * Tudo que é "marca" e "promessa da loja" fica aqui. Troque os valores abaixo
 * antes de publicar — em especial frete grátis, desconto no Pix, CNPJ e redes.
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
  legalName: "VOLT Fitwear Ltda.",
  cnpj: "00.000.000/0001-00",
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

  /** Promessas exibidas no site. Só deixe o que a operação realmente cumpre. */
  freeShippingThreshold: 299,
  pixDiscount: 0.05,
  announcement: ["Frete grátis acima de R$ 299", "5% off no Pix"],
  newsletter: { discountLabel: "10% off", discountCode: "BEMVINDO10" },

  contact: {
    email: "contato@exemplo.com.br",
    whatsapp: "5511999999999",
    hours: "Seg a Sex, 9h às 18h",
  },
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
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
