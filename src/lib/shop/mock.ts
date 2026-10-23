import { site } from "@/config/site";
import { moneyFrom } from "@/lib/utils";
import { sortProducts } from "./sort";
import type {
  ArtSpec,
  Collection,
  CollectionWithProducts,
  Colorway,
  GarmentKind,
  PageContent,
  Product,
  ProductSort,
  ProductSummary,
  Variant,
} from "./types";

/**
 * Catálogo de demonstração: usado enquanto a Shopify não está conectada.
 * As peças são ilustrações vetoriais (src/components/art) no lugar de fotos.
 */

type Seed = {
  handle: string;
  title: string;
  type: string;
  tags: string[];
  price: number;
  compareAt?: number;
  kind: GarmentKind;
  colorway: Colorway;
  sizes: string[];
  colors?: { name: string; colorway: Colorway }[];
  soldOut?: string[];
  created: string;
  blurb: string;
  bullets: string[];
};

const CLOTHING_SIZES = ["P", "M", "G", "GG"];

const seeds: Seed[] = [
  {
    handle: "moletom-canguru-pulse",
    title: "Moletom Canguru Pulse",
    type: "Moletons",
    tags: ["masculino", "feminino", "moletons-e-jaquetas"],
    price: 289.9,
    compareAt: 349.9,
    kind: "hoodie",
    colorway: "black",
    sizes: CLOTHING_SIZES,
    colors: [
      { name: "Preto", colorway: "black" },
      { name: "Cinza", colorway: "gray" },
    ],
    created: "2026-09-20",
    blurb:
      "Moletom com capuz e bolso canguru, macio por dentro e leve o bastante para aquecer antes do treino e sair da academia com estilo.",
    bullets: [
      "Interior macio, sem pinicar",
      "Capuz com cordão em contraste",
      "Punhos e barra elásticos que não deformam",
      "Modelagem unissex confortável",
    ],
  },
  {
    handle: "meia-cano-medio-grip-kit-3",
    title: "Meia Cano Médio Grip (Kit com 3)",
    type: "Meias",
    tags: ["meias-e-acessorios", "masculino", "feminino"],
    price: 69.9,
    kind: "socks",
    colorway: "white",
    sizes: ["34–38", "39–43"],
    created: "2026-08-30",
    blurb:
      "Kit com três pares de meias de cano médio, com reforço no calcanhar e na ponta para acompanhar treinos longos sem esquentar o pé.",
    bullets: [
      "Kit com 3 pares",
      "Reforço no calcanhar e na ponta",
      "Elástico que segura sem apertar",
      "Tecido respirável",
    ],
  },
  {
    handle: "shorts-treino-flex-dry",
    title: "Shorts Treino Flex Dry",
    type: "Shorts",
    tags: ["masculino", "shorts-e-bermudas"],
    price: 119.9,
    kind: "shorts",
    colorway: "black",
    sizes: CLOTHING_SIZES,
    soldOut: ["GG"],
    created: "2026-09-28",
    blurb:
      "Shorts leve com cós elástico e cordão, feito para agachar, correr e saltar sem repuxar nem esquentar.",
    bullets: [
      "Tecido leve de secagem rápida",
      "Cós elástico com cordão ajustável",
      "Costuras planas que reduzem o atrito",
      "Detalhe lateral em contraste",
    ],
  },
  {
    handle: "legging-seamless-cintura-alta",
    title: "Legging Seamless Cintura Alta",
    type: "Leggings",
    tags: ["feminino", "leggings"],
    price: 179.9,
    compareAt: 219.9,
    kind: "leggings",
    colorway: "black",
    sizes: ["PP", "P", "M", "G"],
    created: "2026-10-05",
    blurb:
      "Legging de cintura alta com construção sem costuras, toque macio e compressão confortável que acompanha cada movimento.",
    bullets: [
      "Construção seamless, sem costuras laterais",
      "Cintura alta que não enrola",
      "Compressão confortável",
      "Tecido opaco que não marca",
    ],
  },
  {
    handle: "camiseta-compressao-pro",
    title: "Camiseta Compressão Pro",
    type: "Camisetas",
    tags: ["masculino", "regatas-e-camisetas"],
    price: 99.9,
    kind: "tee",
    colorway: "black",
    sizes: CLOTHING_SIZES,
    created: "2026-08-02",
    blurb:
      "Camiseta de compressão leve para treinos intensos: ajusta ao corpo, seca rápido e mantém a liberdade de movimento.",
    bullets: [
      "Ajuste anatômico",
      "Secagem rápida",
      "Gola reforçada",
      "Etiqueta removível, sem coceira",
    ],
  },
  {
    handle: "regata-dry-fit-respira",
    title: "Regata Dry Fit Respira",
    type: "Regatas",
    tags: ["masculino", "regatas-e-camisetas"],
    price: 79.9,
    kind: "tank",
    colorway: "white",
    sizes: CLOTHING_SIZES,
    created: "2026-07-12",
    blurb:
      "Regata leve e arejada para os dias de treino pesado, com cavas generosas que deixam o ombro livre.",
    bullets: [
      "Tecido arejado de secagem rápida",
      "Cavas amplas para mais mobilidade",
      "Toque macio na pele",
      "Barra reta",
    ],
  },
  {
    handle: "top-fitness-sustentacao-media",
    title: "Top Fitness Sustentação Média",
    type: "Tops",
    tags: ["feminino", "tops"],
    price: 109.9,
    kind: "top",
    colorway: "lime",
    sizes: ["PP", "P", "M", "G"],
    created: "2026-10-12",
    blurb:
      "Top com sustentação média, alças confortáveis e acabamento sem costuras que incomodam, pronto para qualquer treino.",
    bullets: [
      "Sustentação média",
      "Alças largas que não marcam",
      "Faixa inferior elástica",
      "Forro duplo",
    ],
  },
  {
    handle: "bermuda-termica-running",
    title: "Bermuda Térmica Running",
    type: "Bermudas",
    tags: ["masculino", "shorts-e-bermudas"],
    price: 129.9,
    kind: "shorts",
    colorway: "gray",
    sizes: CLOTHING_SIZES,
    created: "2026-09-02",
    blurb:
      "Bermuda para corrida e treinos longos, com ajuste firme nas coxas e cós que fica no lugar do início ao fim.",
    bullets: [
      "Ajuste firme, sem subir",
      "Tecido leve e respirável",
      "Cós com cordão",
      "Detalhes refletivos",
    ],
  },
  {
    handle: "legging-neon-power",
    title: "Legging Neon Power",
    type: "Leggings",
    tags: ["feminino", "leggings"],
    price: 169.9,
    kind: "leggings",
    colorway: "volt",
    sizes: ["PP", "P", "M", "G"],
    created: "2026-10-15",
    blurb:
      "Legging em verde neon para quem gosta de aparecer: tecido firme, cintura alta e recorte lateral que valoriza o movimento.",
    bullets: [
      "Cintura alta",
      "Tecido firme e opaco",
      "Recorte lateral em contraste",
      "Cós confortável",
    ],
  },
  {
    handle: "moletom-capuz-volt",
    title: "Moletom Capuz Volt",
    type: "Moletons",
    tags: ["feminino", "masculino", "moletons-e-jaquetas"],
    price: 299.9,
    kind: "hoodie",
    colorway: "volt",
    sizes: CLOTHING_SIZES,
    created: "2026-10-18",
    blurb:
      "Moletom oversized em verde neon, macio por dentro, com capuz generoso e bolso canguru.",
    bullets: [
      "Modelagem oversized",
      "Interior macio",
      "Capuz com cordão",
      "Bolso canguru",
    ],
  },
  {
    handle: "regata-pump-cavada",
    title: "Regata Pump Cavada",
    type: "Regatas",
    tags: ["masculino", "regatas-e-camisetas"],
    price: 89.9,
    kind: "tank",
    colorway: "black",
    sizes: CLOTHING_SIZES,
    created: "2026-10-20",
    blurb:
      "Regata cavada para treinos de ombro e costas, com tecido leve que seca rápido e não gruda.",
    bullets: [
      "Cavada, liberdade total de ombro",
      "Tecido leve e arejado",
      "Costura reforçada",
      "Toque macio",
    ],
  },
  {
    handle: "camiseta-oversized-gym-club",
    title: "Camiseta Oversized Gym Club",
    type: "Camisetas",
    tags: ["masculino", "feminino", "regatas-e-camisetas"],
    price: 119.9,
    kind: "tee",
    colorway: "white",
    sizes: CLOTHING_SIZES,
    created: "2026-09-10",
    blurb:
      "Camiseta oversized de algodão macio para o pré e o pós-treino, com caimento solto e gola resistente.",
    bullets: [
      "Caimento oversized",
      "Algodão macio",
      "Gola que não abre",
      "Unissex",
    ],
  },
];

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildProduct(seed: Seed, rank: number): Product {
  const price = moneyFrom(seed.price, site.currency);
  const compareAt = seed.compareAt ? moneyFrom(seed.compareAt, site.currency) : null;

  const options = [
    ...(seed.colors ? [{ name: "Cor", values: seed.colors.map((c) => c.name) }] : []),
    { name: "Tamanho", values: seed.sizes },
  ];

  const combos: { color?: { name: string; colorway: Colorway }; size: string }[] = seed.colors
    ? seed.colors.flatMap((color) => seed.sizes.map((size) => ({ color, size })))
    : seed.sizes.map((size) => ({ size }));

  const variants: Variant[] = combos.map(({ color, size }) => {
    const title = color ? `${color.name} / ${size}` : size;
    return {
      id: `gid://mock/ProductVariant/${seed.handle}-${slug(title)}`,
      title,
      sku: `${seed.handle}-${slug(title)}`.toUpperCase().slice(0, 32),
      availableForSale: !seed.soldOut?.includes(size),
      selectedOptions: [
        ...(color ? [{ name: "Cor", value: color.name }] : []),
        { name: "Tamanho", value: size },
      ],
      price,
      compareAtPrice: compareAt,
      image: null,
      art: color ? { kind: seed.kind, colorway: color.colorway } : undefined,
    };
  });

  const art: ArtSpec = { kind: seed.kind, colorway: seed.colorway };
  const description = `${seed.blurb} ${seed.bullets.join(". ")}.`;

  return {
    id: `gid://mock/Product/${rank}`,
    handle: seed.handle,
    title: seed.title,
    vendor: site.name,
    productType: seed.type,
    tags: seed.tags,
    availableForSale: variants.some((variant) => variant.availableForSale),
    createdAt: `${seed.created}T12:00:00Z`,
    updatedAt: `${seed.created}T12:00:00Z`,
    featuredImage: null,
    art,
    price,
    maxPrice: price,
    compareAtPrice: compareAt,
    options,
    variants,
    description,
    descriptionHtml: `<p>${seed.blurb}</p><ul>${seed.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`,
    images: [],
    seo: { title: null, description: null },
    collections: [],
  };
}

const allProducts: Product[] = seeds.map((seed, index) => buildProduct(seed, index + 1));

/** Só o necessário para cartões e listas (não manda descrição nem imagens ao navegador). */
function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    availableForSale: product.availableForSale,
    createdAt: product.createdAt,
    featuredImage: product.featuredImage,
    art: product.art,
    price: product.price,
    maxPrice: product.maxPrice,
    compareAtPrice: product.compareAtPrice,
    options: product.options,
    variants: product.variants,
  };
}

/* -------------------------------------------------------------------------- */
/* Coleções                                                                   */
/* -------------------------------------------------------------------------- */

const collectionSeeds: { handle: string; title: string; description: string }[] = [
  {
    handle: "feminino",
    title: "Feminino",
    description:
      "Leggings, tops e shorts femininos para treinar com conforto, sustentação e estilo.",
  },
  {
    handle: "masculino",
    title: "Masculino",
    description:
      "Regatas, camisetas, shorts e moletons masculinos com tecido respirável para treinar sem limites.",
  },
  {
    handle: "leggings",
    title: "Leggings",
    description: "Leggings de academia cintura alta com toque macio e tecido que não marca.",
  },
  {
    handle: "shorts-e-bermudas",
    title: "Shorts e bermudas",
    description:
      "Shorts e bermudas de treino leves, com cós confortável e liberdade de movimento.",
  },
  {
    handle: "regatas-e-camisetas",
    title: "Regatas e camisetas",
    description: "Regatas e camisetas dry fit para treinar, correr e malhar com mais frescor.",
  },
  {
    handle: "tops",
    title: "Tops",
    description:
      "Tops fitness com sustentação e costuras que não incomodam, para todos os treinos.",
  },
  {
    handle: "moletons-e-jaquetas",
    title: "Moletons e jaquetas",
    description:
      "Moletons e jaquetas para aquecer antes do treino e sair da academia com estilo.",
  },
  {
    handle: "meias-e-acessorios",
    title: "Meias e acessórios",
    description: "Meias e acessórios para completar o look de treino com conforto.",
  },
  {
    handle: "mais-vendidos",
    title: "Mais vendidos",
    description: "As peças favoritas de quem treina com a gente.",
  },
  {
    handle: "lancamentos",
    title: "Lançamentos",
    description: "As novidades que acabaram de chegar.",
  },
];

const collections: Collection[] = collectionSeeds.map((seed, index) => ({
  id: `gid://mock/Collection/${index + 1}`,
  handle: seed.handle,
  title: seed.title,
  description: seed.description,
  updatedAt: "2026-10-20T12:00:00Z",
  image: null,
  seo: { title: null, description: null },
}));

function productsInCollection(handle: string): Product[] {
  if (handle === site.collections.best) return allProducts.slice(0, 8);
  if (handle === site.collections.new) {
    return [...allProducts]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8);
  }
  return allProducts.filter((product) => product.tags.includes(handle));
}

/* -------------------------------------------------------------------------- */
/* API do modo demonstração                                                   */
/* -------------------------------------------------------------------------- */

export function mockListProducts(sort: ProductSort = "default") {
  return sortProducts(allProducts, sort).map(toSummary);
}

export function mockGetProduct(handle: string): Product | null {
  const product = allProducts.find((item) => item.handle === handle);
  if (!product) return null;
  const memberOf = collections
    .filter(
      (collection) =>
        !site.collections.hidden.includes(collection.handle) &&
        product.tags.includes(collection.handle),
    )
    .map(({ handle: h, title }) => ({ handle: h, title }));
  return { ...product, collections: memberOf };
}

export function mockHandles(limit: number) {
  return allProducts.slice(0, limit).map((product) => product.handle);
}

export function mockIndex() {
  return allProducts.map(({ handle, updatedAt }) => ({ handle, updatedAt }));
}

export function mockRecommendations(handle: string): ProductSummary[] {
  const current = allProducts.find((product) => product.handle === handle);
  if (!current) return [];
  return allProducts
    .filter((product) => product.handle !== handle)
    .map((product) => ({
      product,
      score: product.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ product }) => toSummary(product));
}

export function mockSearch(term: string): ProductSummary[] {
  const needle = slug(term).replace(/-/g, " ");
  if (!needle) return [];
  return allProducts
    .filter((product) => {
      const haystack = slug(`${product.title} ${product.productType} ${product.tags.join(" ")}`).replace(
        /-/g,
        " ",
      );
      return needle.split(" ").every((word) => haystack.includes(word));
    })
    .map(toSummary);
}

export function mockCollections() {
  return collections;
}

export function mockCollection(
  handle: string,
  sort: ProductSort = "default",
): CollectionWithProducts | null {
  const collection = collections.find((item) => item.handle === handle);
  if (!collection) return null;
  return {
    ...collection,
    products: sortProducts(productsInCollection(handle), sort).map(toSummary),
  };
}

export function mockCollectionIndex() {
  return collections.map(({ handle, updatedAt }) => ({ handle, updatedAt }));
}

const pages: Record<string, { title: string; body: string }> = {
  sobre: {
    title: "Sobre a VOLT",
    body: `<p>A ${site.name} nasceu de uma ideia simples: roupa de treino precisa ser confortável de verdade, do primeiro ao último exercício.</p>
<p>Escolhemos tecidos leves e respiráveis, costuras que não marcam e modelagens que acompanham o corpo em movimento, para você pensar só no treino.</p>
<p><em>Texto de exemplo: conte aqui a história da sua marca.</em></p>`,
  },
  entregas: {
    title: "Entregas e prazos",
    body: `<p>O prazo estimado e o valor do frete aparecem no checkout, antes de você pagar.</p>
<p>Depois da confirmação do pagamento, você recebe o código de rastreio por e-mail.</p>
<p><em>Texto de exemplo: descreva aqui as transportadoras, prazos de postagem e a regra de frete grátis da sua operação.</em></p>`,
  },
  "trocas-e-devolucoes": {
    title: "Trocas e devoluções",
    body: `<p>Compras feitas pela internet podem ser desfeitas em até 7 dias corridos após o recebimento, conforme o artigo 49 do Código de Defesa do Consumidor.</p>
<p>Para pedir troca ou devolução, fale com a nossa equipe pelo e-mail ou WhatsApp informados no rodapé.</p>
<p><em>Texto de exemplo: revise com o seu contador/advogado e inclua o prazo de troca por tamanho que a sua operação oferece.</em></p>`,
  },
  privacidade: {
    title: "Política de privacidade",
    body: `<p>Tratamos os seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).</p>
<p>Coletamos apenas as informações necessárias para processar o seu pedido, entregar o produto e atender você.</p>
<p><em>Texto de exemplo: substitua por uma política de privacidade revisada por um profissional.</em></p>`,
  },
  termos: {
    title: "Termos de uso",
    body: `<p>Ao usar este site, você concorda com as condições de compra, entrega e troca descritas nas nossas políticas.</p>
<p><em>Texto de exemplo: substitua por termos de uso revisados por um profissional.</em></p>`,
  },
};

export function mockPage(handle: string): PageContent | null {
  const page = pages[handle];
  if (!page) return null;
  return {
    handle,
    title: page.title,
    body: page.body,
    summary: page.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
    updatedAt: "2026-10-20T12:00:00Z",
  };
}
