import type { ReactNode } from "react";
import type { ArtSpec, Colorway, GarmentKind } from "@/lib/shop/types";

/**
 * Peças de treino desenhadas em SVG para o modo demonstração. Quando a Shopify
 * está conectada, as fotos do fornecedor ocupam o lugar destas ilustrações.
 */

type Palette = {
  body: string;
  dark: string;
  light: string;
  line: string;
  accent: string;
  /** Contorno sutil para peças claras não sumirem em fundo claro. */
  edge?: string;
};

const palettes: Record<Colorway, Palette> = {
  black: { body: "#1a1d1f", dark: "#0a0b0c", light: "#3b4246", line: "#3a4044", accent: "#5ce52e" },
  white: {
    body: "#f4f5f0",
    dark: "#d2d5ca",
    light: "#ffffff",
    line: "#c2c6ba",
    accent: "#0d0f0c",
    edge: "#8c9283",
  },
  volt: { body: "#5ce52e", dark: "#32ab18", light: "#9bf678", line: "#3bbd1f", accent: "#0d0f0c" },
  lime: {
    body: "#d7ff3d",
    dark: "#a6cc18",
    light: "#ecffa6",
    line: "#b2d820",
    accent: "#0d0f0c",
    edge: "#9bb81a",
  },
  gray: { body: "#8d9389", dark: "#656b61", light: "#b6bbb0", line: "#767c72", accent: "#5ce52e" },
};

/**
 * Desenha a metade esquerda e espelha. O espelho entra 0,6px sobre a metade
 * original para não aparecer a emenda de antialiasing no meio da peça.
 */
function Mirror({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(399.4 0) scale(-1 1)">{children}</g>
    </>
  );
}

const BOLT = "M10 0 0 14h7l-2 10 11-15H9z";

function Hoodie({ p }: { p: Palette }) {
  return (
    <>
      <path d="M146 114C120 62 158 22 200 22s80 40 54 92Z" fill={p.body} />
      <path
        d="M158 96C150 64 170 40 200 38"
        stroke={p.light}
        strokeWidth="4"
        strokeLinecap="round"
        opacity=".45"
        fill="none"
      />
      <ellipse cx="200" cy="98" rx="46" ry="30" fill={p.dark} />
      <Mirror>
        <path
          d="M200 130C184 130 166 120 156 100L120 114C104 121 92 134 86 152L58 292C56 302 62 308 70 310L100 316C108 318 114 313 116 305L134 212L130 320C130 328 134 334 142 334H200Z"
          fill={p.body}
        />
        <path d="M59 282 111 294 100 316 70 310C62 308 56 302 58 294Z" fill={p.dark} />
        <path d="M134 212 130 320 148 322 150 216Z" fill={p.dark} opacity=".25" />
        <path d="M131 312H200V334H142C134 334 130 328 130 320Z" fill={p.dark} />
        <path
          d="M188 128C186 152 184 174 186 198"
          stroke={p.accent}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="182" y="194" width="8" height="15" rx="4" fill={p.accent} />
        <path
          d="M122 124C108 134 98 148 94 168"
          stroke={p.light}
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".28"
          fill="none"
        />
      </Mirror>
      <path
        d="M146 240H254L268 298H132Z"
        fill="none"
        stroke={p.line}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M150 240 138 298M250 240l12 58" stroke={p.line} strokeWidth="3" opacity=".7" />
      <path transform="translate(224 148) scale(1.1)" d={BOLT} fill={p.accent} />
    </>
  );
}

function Tank({ p }: { p: Palette }) {
  return (
    <>
      <Mirror>
        <path
          d="M200 128C184 128 168 110 162 60L122 72C122 112 138 150 138 170C138 186 126 198 122 214L116 338C115 346 120 352 128 352H200Z"
          fill={p.body}
        />
        <path d="M117 320H200V352H128C120 352 115 346 116 338Z" fill={p.dark} />
        <path
          d="M122 72C122 112 138 150 138 170C138 186 126 198 122 214"
          stroke={p.accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M162 60C168 110 184 128 200 128"
          stroke={p.accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M130 216 124 322 140 322 146 218Z" fill={p.dark} opacity=".2" />
      </Mirror>
      <path transform="translate(190 182) scale(1.15)" d={BOLT} fill={p.accent} />
    </>
  );
}

function Tee({ p }: { p: Palette }) {
  return (
    <>
      <Mirror>
        <path
          d="M200 66C186 66 170 62 158 52L112 78L52 150L88 188L130 158L128 322C128 332 132 338 140 338H200Z"
          fill={p.body}
        />
        <path d="M129 306H200V338H140C132 338 128 332 128 322Z" fill={p.dark} opacity=".9" />
        <path
          d="M60 141 96 177"
          stroke={p.accent}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M130 160 128 300 146 300 148 164Z" fill={p.dark} opacity=".2" />
        <path d="M158 52 112 78" stroke={p.line} strokeWidth="2.5" fill="none" />
      </Mirror>
      <path d="M156 52C166 98 234 98 244 52" stroke={p.dark} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M162 52C172 40 228 40 238 52C230 84 170 84 162 52Z" fill={p.dark} />
      <path transform="translate(222 150) scale(.95)" d={BOLT} fill={p.accent} />
    </>
  );
}

function Shorts({ p }: { p: Palette }) {
  return (
    <>
      <Mirror>
        <path
          d="M200 92H114C109 92 105 95 104 100L76 296C75 305 80 311 88 311H182C188 311 191 306 191 300L200 204Z"
          fill={p.body}
        />
        <path d="M114 92H200V124H101L104 100C105 95 109 92 114 92Z" fill={p.dark} />
        <path d="M111 130 87 292" stroke={p.accent} strokeWidth="7" strokeLinecap="round" />
        <path
          d="M190 124C189 146 188 160 190 178"
          stroke={p.accent}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M200 124V204" stroke={p.line} strokeWidth="2.5" />
        <path d="M80 286C100 296 150 296 186 290" stroke={p.dark} strokeWidth="14" opacity=".35" fill="none" />
        <path d="M136 132C134 180 128 230 124 280" stroke={p.light} strokeWidth="4" strokeLinecap="round" opacity=".22" fill="none" />
      </Mirror>
    </>
  );
}

function Leggings({ p }: { p: Palette }) {
  return (
    <>
      <Mirror>
        <path
          d="M200 44H116C112 44 109 47 108 52L102 120C100 170 114 220 124 262L134 348C135 356 140 360 146 360H168C174 360 178 355 178 349L180 262C181 232 192 206 200 182Z"
          fill={p.body}
        />
        <path d="M200 44H116C112 44 109 47 108 52L105 92H200Z" fill={p.dark} />
        <path d="M105 92H200" stroke={p.accent} strokeWidth="3.5" />
        <path
          d="M110 128C108 180 122 228 130 264L137 340"
          stroke={p.accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M200 92V182" stroke={p.line} strokeWidth="2.5" />
        <path
          d="M150 150C146 200 148 250 152 300"
          stroke={p.light}
          strokeWidth="5"
          strokeLinecap="round"
          opacity=".18"
          fill="none"
        />
      </Mirror>
    </>
  );
}

function Top({ p }: { p: Palette }) {
  return (
    <>
      <Mirror>
        <path
          d="M200 154C188 154 176 148 168 136L156 60H124L118 128C112 150 110 178 114 206L118 252C140 258 170 258 200 256Z"
          fill={p.body}
        />
        <path d="M113 206C142 218 172 220 200 220V256C170 258 140 258 118 252Z" fill={p.dark} />
        <path
          d="M113 206C142 218 172 220 200 220"
          stroke={p.accent}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M124 60 118 128C112 150 110 178 114 206"
          stroke={p.accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M200 154V220" stroke={p.line} strokeWidth="2.5" />
        <path d="M134 150C132 170 132 190 136 206" stroke={p.light} strokeWidth="4" strokeLinecap="round" opacity=".3" fill="none" />
      </Mirror>
      <path transform="translate(190 170) scale(.8)" d={BOLT} fill={p.accent} />
    </>
  );
}

const SOCK =
  "M0 0H56V126C56 146 70 156 88 160L128 168C150 173 158 192 154 208C150 226 136 232 118 232H20C4 232 -6 220 -4 202L0 130Z";

function Sock({ p }: { p: Palette }) {
  return (
    <>
      <path d={SOCK} fill={p.body} />
      <path d="M0 0H56V28H0Z" fill={p.dark} />
      <rect x="0" y="33" width="56" height="8" fill={p.accent} />
      <path d="M-4 202C-6 220 4 232 20 232H44C40 218 36 204 38 190Z" fill={p.dark} />
      <path d="M118 232C136 232 150 226 154 208C158 192 150 173 128 168L120 168C130 186 130 212 118 232Z" fill={p.dark} />
      <path d="M14 54V118" stroke={p.light} strokeWidth="4" strokeLinecap="round" opacity=".55" />
    </>
  );
}

/** Par de meias frente a frente: o da direita é o espelho do da esquerda. */
function Socks({ p }: { p: Palette }) {
  return (
    <>
      <g transform="translate(40 84) rotate(-3)">
        <Sock p={p} />
      </g>
      <g transform="translate(360 84) scale(-1 1) rotate(-3)">
        <Sock p={p} />
      </g>
    </>
  );
}

const drawings: Record<GarmentKind, (props: { p: Palette }) => ReactNode> = {
  hoodie: Hoodie,
  tank: Tank,
  tee: Tee,
  shorts: Shorts,
  leggings: Leggings,
  top: Top,
  socks: Socks,
};

type GarmentProps = Partial<ArtSpec> & {
  className?: string;
  title?: string;
  /** Desenha a sombra no chão sob a peça. */
  shadow?: boolean;
};

export function Garment({
  kind = "hoodie",
  colorway = "black",
  className,
  title,
  shadow = true,
}: GarmentProps) {
  const palette = palettes[colorway];
  const Drawing = drawings[kind];
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {shadow && <ellipse cx="200" cy="374" rx="112" ry="9" fill="#000" opacity=".13" />}
      <g
        style={
          palette.edge
            ? {
                filter: `drop-shadow(0 0 0.7px ${palette.edge}) drop-shadow(0 0 0.7px ${palette.edge})`,
              }
            : undefined
        }
      >
        <Drawing p={palette} />
      </g>
    </svg>
  );
}
