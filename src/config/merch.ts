/**
 * Curadoria visual da vitrine: quais fotos o cliente vê primeiro.
 *
 * Cada foto é indicada pelo produto (handle) e por um trecho do nome do arquivo da foto na Shopify (o que vem
 * depois de `/files/` no endereço da imagem). O nome não muda quando você reordena as fotos no painel.
 * Foto ou produto que deixar de existir é ignorado: o site usa a primeira foto do produto e, sem Shopify
 * (modo demonstração), as ilustrações.
 */

export type PhotoPick = { product: string; photo?: string };

/** Vitrine de preço baixo: produtos com este tipo (Shopify → Produto → Tipo de produto); `collection` é o "Ver todas". */
export type DealPick = { title: string; type: string; collection: string };

/** Kit do carro-chefe: `quantity` peças com `off` reais de desconto no total (desconto automático da Shopify). */
export type Bundle = { quantity: number; off: number };

export const merch = {
  /**
   * Produto carro-chefe, o dos anúncios: ganha uma faixa na home e, na página dele, destaques e perguntas próprias.
   * Link para os anúncios: /produtos/<product>. Produto que não existir na loja: nada disso aparece.
   */
  flagship: {
    product: "legging-empina-bumbum-sem-costura-cintura-alta",
    eyebrow: "Destaque da loja",
    title: "Legging empina bumbum",
    text: "Sem costura, de cintura alta e com franzido atrás. Em preto e cinza mescla, do P ao 2XL.",
    cta: "Quero a minha",
    /**
     * Kits com desconto ("2 por R$ 159,90"). SÓ preencha depois de criar em Shopify → Descontos, para cada kit, um
     * desconto AUTOMÁTICO de valor fixo neste produto, "uma vez por pedido", com quantidade mínima igual a `quantity`
     * (o site só mostra a conta; quem aplica o desconto é a Shopify). Vazio = sem kits.
     */
    bundles: [] as Bundle[],
    highlights: [
      { title: "Franzido atrás", text: "A costura franzida no bumbum é o detalhe que dá o nome de empina bumbum." },
      { title: "Cintura alta", text: "O cós sobe até a cintura e cobre o abdômen." },
      { title: "Sem costura", text: "Malha inteiriça com textura listrada, sem costuras laterais." },
      { title: "Do P ao 2XL", text: "Numeração asiática, que veste menor: use o guia de tamanhos antes de escolher." },
    ],
    faq: [
      {
        question: "Qual tamanho devo escolher?",
        answer:
          "A numeração segue o padrão asiático e costuma vestir menor. Confira o guia de tamanhos ao lado da escolha de tamanho e, em dúvida entre dois, escolha o maior.",
      },
      {
        question: "Posso devolver se não gostar?",
        answer:
          "Sim. Você tem 7 dias após o recebimento para desistir da compra, como manda o Código de Defesa do Consumidor. Para trocar de tamanho, fale com a gente.",
      },
      {
        question: "Quanto custa o frete e quando chega?",
        answer:
          "Calcule pelo CEP no carrinho. O valor e o prazo finais aparecem no checkout, antes de você pagar, e o código de rastreio chega por e-mail quando o pedido é enviado.",
      },
    ],
  },

  /**
   * Ordem dos "Destaques" da home enquanto não existir a coleção "Mais vendidos" (que passa a valer sozinha).
   * Primeiro os produtos com foto de modelo; os que não estiverem aqui vêm depois, na ordem da Shopify.
   */
  featured: [
    "conjunto-fitness-feminino-top-manga-longa-legging",
    "camiseta-esportiva-masculina-modal-secagem-rapida",
    "short-ciclista-fitness-feminino-cintura-alta",
    "conjunto-esportivo-feminino-casaco-gola-alta-calca-pantalona",
    "moletom-masculino-ziper-capuz",
    "top-esportivo-feminino-costas-nadador-alta-sustentacao",
    "jaqueta-fitness-feminina-ziper-manga-longa",
    "bolsa-academia-viagem-couro-sintetico-alca-ombro",
  ] as string[],

  /**
   * Vitrines de preço baixo logo abaixo do topo da home, do mais barato ao mais caro, com o "A partir de" tirado do
   * menor preço. Cada uma só aparece com 2 produtos ou mais; o "Ver todas" só aparece se a coleção existir.
   */
  deals: [
    { title: "Leggings", type: "Leggings", collection: "leggings" },
    { title: "Regatas", type: "Regatas", collection: "regatas" },
  ] satisfies DealPick[],

  /** Topo da home: fotos de modelo, recortadas na vertical (no celular aparece só a primeira). */
  hero: [
    { product: "conjunto-fitness-feminino-top-manga-longa-legging", photo: "O1CN01eo7JOA1cUDuUo3ZkC" },
    { product: "camiseta-esportiva-masculina-modal-secagem-rapida", photo: "O1CN01GoqeYr26QVQWUx1rw" },
    { product: "short-ciclista-fitness-feminino-cintura-alta", photo: "O1CN01AzNnJm1RDJez8fLht" },
  ] satisfies PhotoPick[],

  /** Foto de cada categoria quando a coleção não tem imagem própria (Shopify → Coleções → Imagem). */
  categories: {
    feminino: { product: "conjunto-fitness-feminino-top-manga-longa-legging", photo: "O1CN01y5HkPv1cUDuMQslzT" },
    masculino: { product: "camiseta-esportiva-masculina-modal-secagem-rapida", photo: "O1CN01GQv9E826QVQWlD0h0" },
    conjuntos: {
      product: "conjunto-esportivo-feminino-casaco-gola-alta-calca-pantalona",
      photo: "O1CN01uOnim31RTLdZD1zxX",
    },
    "tops-esportivos": { product: "top-esportivo-feminino-costas-nadador-alta-sustentacao", photo: "23305033940" },
    shorts: { product: "short-ciclista-fitness-feminino-cintura-alta", photo: "O1CN01nQpsUR1RDJezom8mi" },
    "regatas-e-camisetas": { product: "camiseta-fitness-feminina-slim-manga-curta", photo: "O1CN015MsEV92LGAck4oLGw" },
    moletons: { product: "moletom-masculino-ziper-capuz", photo: "O1CN01vkAb8A1wJV7vo2JyE" },
    jaquetas: { product: "jaqueta-fitness-feminina-ziper-manga-longa", photo: "O1CN01c5SsZy1eAeQ0zaN5M" },
    "bones-e-acessorios": {
      product: "bolsa-academia-viagem-couro-sintetico-alca-ombro",
      photo: "O1CN01s5UEvn1mBZq13cm4G",
    },
  } as Record<string, PhotoPick>,

  /**
   * Foto de capa (cards, Google e compartilhamento) dos produtos cuja 1ª foto na Shopify é uma colagem de cores.
   * O ideal é arrastar a foto certa para o 1º lugar no painel da Shopify e apagar a linha daqui.
   */
  covers: {
    "bolsa-tote-lona-yoga-pilates-alca-tapete": "O1CN01c5Xisp1VUUgyJgrLI",
    "moletom-masculino-ziper-capuz": "O1CN01vkAb8A1wJV7vo2JyE",
    "conjunto-moletom-feminino-capuz-calca-jogger": "O1CN01Q1RJYb1n8f8OolR66",
    "regata-feminina-gola-quadrada-basica": "O1CN01E7Zb8B1r9oeMas1yz",
    "top-esportivo-feminino-costas-nadador-alta-sustentacao": "23305033940",
    "jaqueta-fitness-feminina-ziper-manga-longa": "O1CN01c5SsZy1eAeQ0zaN5M",
  } as Record<string, string>,

  /** Faixa com fotos no meio da home, levando a uma coleção (some se a coleção não existir). */
  editorial: {
    collection: "conjuntos",
    eyebrow: "Conjuntos",
    title: "O look completo, do aquecimento ao pós-treino",
    text: "Peças que combinam entre si, para treinar e sair com estilo sem pensar no que vestir.",
    cta: "Ver conjuntos",
    photos: [
      { product: "conjunto-feminino-casaco-botoes-calca-pantalona", photo: "O1CN015KylHD9qxtG1hk6i" },
      { product: "conjunto-feminino-casaco-botoes-calca-pantalona", photo: "O1CN01hFyGhW7CDnB1hcIo" },
    ] satisfies PhotoPick[],
  },
};
