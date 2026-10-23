// Fora de rail.tsx de propósito: constantes exportadas de um módulo "use client" viram referências de
// cliente quando importadas num Server Component (não seriam a string).

/** Largura de um card de produto no carrossel: ~2 no celular, 3 no tablet, 4 no desktop. */
export const railItem = "w-[44%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-0.95rem)]";
