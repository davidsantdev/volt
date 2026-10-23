import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Webhook da Shopify: quando um produto/coleção/página muda, invalida só o cache
 * correspondente (as etiquetas vêm de src/lib/shop/index.ts).
 *
 * Cadastre em Shopify > Configurações > Notificações > Webhooks apontando para
 * https://SEU-DOMINIO/api/shopify/revalidate (formato JSON) para os eventos
 * products/*, collections/* e pages/*. O segredo exibido ali vai em SHOPIFY_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook não configurado.", { status: 501 });

  const body = await request.text();
  const received = Buffer.from(request.headers.get("x-shopify-hmac-sha256") ?? "");
  const expected = Buffer.from(createHmac("sha256", secret).update(body, "utf8").digest("base64"));
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return new Response("Assinatura inválida.", { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  let handle: string | undefined;
  try {
    const payload = JSON.parse(body) as { handle?: unknown };
    if (typeof payload.handle === "string") handle = payload.handle;
  } catch {
    // corpo sem handle (ex.: products/delete): só invalida as listas
  }

  // "max": o visitante nunca espera; recebe a versão antiga enquanto a nova é gerada.
  if (topic.startsWith("products/")) {
    revalidateTag("products", "max");
    if (handle) revalidateTag(`product:${handle}`, "max");
  } else if (topic.startsWith("collections/")) {
    revalidateTag("collections", "max");
    if (handle) revalidateTag(`collection:${handle}`, "max");
  } else if (topic.startsWith("pages/")) {
    revalidateTag("pages", "max");
    if (handle) revalidateTag(`page:${handle}`, "max");
  } else {
    return Response.json({ ok: true, ignored: topic });
  }

  return Response.json({ ok: true, topic, handle });
}
