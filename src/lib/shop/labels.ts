/**
 * Rótulos em português para dados que chegam em inglês dos fornecedores de dropshipping
 * (nomes de opção "Color"/"Size" e cores como "Light green"). O que não estiver aqui
 * aparece do jeito que veio da Shopify.
 */

const OPTION_LABELS: Record<string, string> = {
  color: "Cor",
  colour: "Cor",
  颜色: "Cor",
  颜色分类: "Cor",
  size: "Tamanho",
  尺码: "Tamanho",
  尺寸: "Tamanho",
  style: "Estilo",
  material: "Material",
};

export function optionLabel(name: string) {
  return OPTION_LABELS[name.trim().toLowerCase()] ?? name;
}

const SIZE_RANK: Record<string, number> = {
  xxs: 0, pp: 1, xs: 1, s: 2, p: 2, m: 3, l: 4, g: 4, xl: 5, gg: 5,
  xxl: 6, "2xl": 6, xxg: 6, xxxl: 7, "3xl": 7, "4xl": 8, "5xl": 9,
};

/**
 * Fornecedores listam os tamanhos na ordem em que cadastraram (M, L, XL, XS, S).
 * Aqui ficam na ordem natural: XS, S, M, L, XL... ou 36, 38, 40. Se algum valor não for
 * reconhecido, a ordem original é mantida.
 */
export function sortOptionValues(name: string, values: string[]) {
  if (optionLabel(name) !== "Tamanho") return values;
  const ranks = values.map((value) => {
    const key = value.trim().toLowerCase().replace(/\s+/g, "");
    if (key in SIZE_RANK) return SIZE_RANK[key];
    const numeric = Number(key.replace(",", "."));
    return key !== "" && Number.isFinite(numeric) ? 100 + numeric : null;
  });
  if (ranks.some((rank) => rank === null)) return values;
  return values
    .map((value, index) => ({ value, rank: ranks[index] as number }))
    .sort((a, b) => a.rank - b.rank)
    .map((item) => item.value);
}

type ColorInfo = { label: string; hex: string };

const COLORS: Record<string, ColorInfo> = {
  black: { label: "Preto", hex: "#17191b" },
  advancedblack: { label: "Preto", hex: "#17191b" },
  preto: { label: "Preto", hex: "#17191b" },
  white: { label: "Branco", hex: "#f4f5f0" },
  branco: { label: "Branco", hex: "#f4f5f0" },
  gray: { label: "Cinza", hex: "#8d9389" },
  grey: { label: "Cinza", hex: "#8d9389" },
  cinza: { label: "Cinza", hex: "#8d9389" },
  lightgray: { label: "Cinza-claro", hex: "#d4d6d2" },
  lightgrey: { label: "Cinza-claro", hex: "#d4d6d2" },
  whitegray: { label: "Cinza-claro", hex: "#d4d6d2" },
  darkgray: { label: "Cinza-escuro", hex: "#4b4f4c" },
  pink: { label: "Rosa", hex: "#f4a6c0" },
  rosa: { label: "Rosa", hex: "#f4a6c0" },
  cherryblossompowder: { label: "Rosa-claro", hex: "#f2c4cf" },
  lotusrootstarch: { label: "Rosa-nude", hex: "#d9b8ae" },
  blue: { label: "Azul", hex: "#2f6bff" },
  azul: { label: "Azul", hex: "#2f6bff" },
  futureblue: { label: "Azul", hex: "#4a90e2" },
  skyblue: { label: "Azul-céu", hex: "#87ceeb" },
  navyblue: { label: "Azul-marinho", hex: "#1d2a52" },
  green: { label: "Verde", hex: "#2f9e57" },
  verde: { label: "Verde", hex: "#2f9e57" },
  basilgreen: { label: "Verde", hex: "#2e7d4f" },
  lightgreen: { label: "Verde-claro", hex: "#b9e3b0" },
  darkgreen: { label: "Verde-escuro", hex: "#1f5a3a" },
  armygreen: { label: "Verde-militar", hex: "#6b7050" },
  militarygreen: { label: "Verde-militar", hex: "#5b6b3a" },
  graygreen: { label: "Verde-acinzentado", hex: "#6f7d6a" },
  graycoffee: { label: "Cinza-café", hex: "#7c7360" },
  lightblue: { label: "Azul-claro", hex: "#a9cdf0" },
  darkblue: { label: "Azul-escuro", hex: "#1f3a6e" },
  navy: { label: "Azul-marinho", hex: "#1d2a52" },
  fogblue: { label: "Azul-névoa", hex: "#8fa9c9" },
  hazeblue: { label: "Azul-claro", hex: "#a9c4e8" },
  grayblue: { label: "Azul-acinzentado", hex: "#8f9bb3" },
  volcanicash: { label: "Cinza-vulcânico", hex: "#8a8d90" },
  taropurple: { label: "Roxo-taro", hex: "#b6a4dc" },
  offwhite: { label: "Off-white", hex: "#efeadc" },
  winered: { label: "Vinho", hex: "#6d1f2f" },
  wine: { label: "Vinho", hex: "#6d1f2f" },
  rose: { label: "Rosa-choque", hex: "#e0457b" },
  aqua: { label: "Turquesa", hex: "#58cfd6" },
  khaki: { label: "Cáqui", hex: "#b9a77a" },
  khakis: { label: "Creme", hex: "#e8e0cf" },
  lotuscolor: { label: "Rosa-antigo", hex: "#d9a9b0" },
  purple: { label: "Roxo", hex: "#7b4dff" },
  giantpurple: { label: "Roxo", hex: "#5b2a5e" },
  darkpurple: { label: "Roxo-escuro", hex: "#4a2748" },
  brown: { label: "Marrom", hex: "#7a5a43" },
  milkbrown: { label: "Marrom-claro", hex: "#b89b86" },
  camelbrown: { label: "Caramelo", hex: "#b98a58" },
  red: { label: "Vermelho", hex: "#e03b3b" },
  yellow: { label: "Amarelo", hex: "#ffd23f" },
  orange: { label: "Laranja", hex: "#ff8a2a" },
  beige: { label: "Bege", hex: "#d9c7a6" },
  apricot: { label: "Damasco", hex: "#f6c7a0" },
  magenta: { label: "Magenta", hex: "#d6246e" },
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function colorInfo(value: string): ColorInfo | null {
  return COLORS[normalize(value)] ?? null;
}

export function colorLabel(value: string) {
  return colorInfo(value)?.label ?? value;
}

const SIZE_LABELS: Record<string, string> = {
  onesize: "Único",
  freesize: "Único",
  onesizefitsall: "Único",
};

/** "One Size" -> "Único"; os demais tamanhos (S, M, L, 2XL, 40...) ficam como vieram. */
export function sizeLabel(value: string) {
  return SIZE_LABELS[normalize(value)] ?? value;
}

/** Rótulo de qualquer valor de opção: cor traduzida, tamanho único em português ou o valor como veio. */
export function valueLabel(value: string) {
  return colorInfo(value)?.label ?? sizeLabel(value);
}

/** "Black / S" -> "Preto / S" (só traduz as partes que são cores ou tamanho único conhecidos). */
export function variantLabel(title: string) {
  return title
    .split(" / ")
    .map((part) => valueLabel(part))
    .join(" / ");
}
