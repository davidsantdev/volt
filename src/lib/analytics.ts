import { numericId } from "@/lib/utils";

/**
 * Pixels de anúncio: Meta (Facebook e Instagram), Google (Analytics 4 e Google Ads) e TikTok. Cada um só liga com o
 * código no .env (variáveis NEXT_PUBLIC_*), e nada carrega antes de o visitante aceitar os cookies (LGPD): os
 * eventos esperam numa fila até o "Aceitar" e são descartados no "Recusar".
 *
 * O site registra visita, produto visto, carrinho, busca e início do checkout. A compra acontece no checkout da
 * Shopify e é registrada pelos apps oficiais de cada rede instalados na Shopify (use o mesmo pixel nos dois lugares).
 * Os ids são os do feed de produtos (/feeds/google.xml): variação em `g:id`, produto em `g:item_group_id`.
 */

/** Só letras, números, "-" e "_": o código entra dentro de um script. */
const clean = (value: string | undefined) => value?.trim().replace(/[^\w-]/g, "") || null;

export const pixelIds = {
  meta: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  /** Google Analytics 4 (G-…). */
  ga: clean(process.env.NEXT_PUBLIC_GA_ID),
  /** Google Ads (AW-…): recebe os mesmos eventos pelo gtag. */
  googleAds: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  tiktok: clean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
};

export const hasPixels = Object.values(pixelIds).some(Boolean);

type Fn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fn;
    gtag?: Fn;
    ttq?: { page: Fn; track: Fn };
  }
}

let status: "waiting" | "on" | "off" = "waiting";
const queue: (() => void)[] = [];

function emit(send: () => void, { wait = true } = {}) {
  if (status === "on") send();
  else if (status === "waiting" && wait && queue.length < 30) queue.push(send);
}

/** Código oficial de cada rede: script inline inserido no DOM roda na hora e cria a fila da própria rede. */
function inline(code: string) {
  const script = document.createElement("script");
  script.text = code;
  document.head.appendChild(script);
}

/** Carrega os pixels (depois do "Aceitar") e envia o que estava na fila. */
export function startPixels() {
  if (status === "on") return;
  const { meta, ga, googleAds, tiktok } = pixelIds;
  if (meta) {
    inline(
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`,
    );
  }
  const google = [ga, googleAds].filter(Boolean);
  if (google.length > 0) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${google[0]}`;
    document.head.appendChild(script);
    inline(
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${google.map((id) => `gtag('config','${id}');`).join("")}`,
    );
  }
  if (tiktok) {
    inline(
      `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${tiktok}');ttq.page();}(window,document,'ttq');`,
    );
  }
  status = "on";
  for (const send of queue.splice(0)) send();
}

/** "Recusar": nada carrega e a fila é descartada. */
export function stopPixels() {
  status = "off";
  queue.length = 0;
}

export type TrackedItem = { id: string; title: string; price: number; quantity?: number };
type Payload = { currency: string; items: TrackedItem[] };

function send(
  event: { meta: string; google: string; tiktok: string },
  { currency, items }: Payload,
  contentType: "product" | "product_group",
) {
  const lines = items.map((item) => ({ ...item, id: numericId(item.id), quantity: item.quantity ?? 1 }));
  const value = Number(lines.reduce((sum, line) => sum + line.price * line.quantity, 0).toFixed(2));
  emit(() => {
    window.fbq?.("track", event.meta, {
      content_ids: lines.map((line) => line.id),
      content_type: contentType,
      contents: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      value,
      currency,
    });
    window.gtag?.("event", event.google, {
      currency,
      value,
      items: lines.map((line) => ({ item_id: line.id, item_name: line.title, price: line.price, quantity: line.quantity })),
    });
    window.ttq?.track(event.tiktok, {
      contents: lines.map((line) => ({
        content_id: line.id,
        content_type: contentType,
        content_name: line.title,
        price: line.price,
        quantity: line.quantity,
      })),
      value,
      currency,
    });
  });
}

/** Página de produto aberta (id do produto, o `g:item_group_id` do feed). */
export function trackViewItem(payload: Payload) {
  send({ meta: "ViewContent", google: "view_item", tiktok: "ViewContent" }, payload, "product_group");
}

/** Item no carrinho (id da variação, o `g:id` do feed). */
export function trackAddToCart(payload: Payload) {
  send({ meta: "AddToCart", google: "add_to_cart", tiktok: "AddToCart" }, payload, "product");
}

/** Clique em "Finalizar compra": dali em diante quem mede é o checkout da Shopify. */
export function trackBeginCheckout(payload: Payload) {
  send({ meta: "InitiateCheckout", google: "begin_checkout", tiktok: "InitiateCheckout" }, payload, "product");
}

export function trackSearch(term: string) {
  emit(() => {
    window.fbq?.("track", "Search", { search_string: term });
    window.gtag?.("event", "search", { search_term: term });
    window.ttq?.track("Search", { query: term });
  });
}

/**
 * Troca de página sem recarregar. Meta e Google contam sozinhos (History API); o TikTok precisa do aviso.
 * Não entra na fila: a primeira visita já é contada quando o pixel carrega.
 */
export function trackPageView() {
  emit(() => window.ttq?.page(), { wait: false });
}
