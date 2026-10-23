/**
 * Curadoria visual da vitrine: quais fotos o cliente vê primeiro.
 *
 * Cada foto é indicada pelo produto (handle) e por um trecho do nome do arquivo da foto na Shopify (o que vem
 * depois de `/files/` no endereço da imagem). O nome não muda quando você reordena as fotos no painel.
 * Foto ou produto que deixar de existir é ignorado: o site usa a primeira foto do produto e, sem Shopify
 * (modo demonstração), as ilustrações.
 */

export type PhotoPick = { product: string; photo?: string };

export const merch = {
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
