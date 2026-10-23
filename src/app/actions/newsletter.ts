"use server";

import { headers } from "next/headers";
import { site } from "@/config/site";
import { isShopifyConfigured } from "@/lib/shop/config";
import { subscribeToNewsletter } from "@/lib/shop/shopify";

export type NewsletterState = { status: "idle" | "success" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FAILED: NewsletterState = { status: "error", message: "Não conseguimos concluir agora. Tente novamente em instantes." };

function success(): NewsletterState {
  return {
    status: "success",
    // Só cita cupom se ele foi configurado (e criado em Shopify → Descontos).
    message: site.newsletter.discountCode
      ? `Pronto! Use o cupom ${site.newsletter.discountCode} na sua primeira compra.`
      : "Pronto! Você vai receber nossos lançamentos e ofertas por e-mail.",
  };
}

/**
 * Cadastra o e-mail como cliente com consentimento de marketing na Shopify: pela Admin API se houver
 * SHOPIFY_ADMIN_ACCESS_TOKEN; senão pela Storefront API (mesmo token do site). Sem Shopify, só simula.
 */
export async function subscribeAction(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Campo-isca invisível: robôs preenchem, pessoas não.
  if (formData.get("website")) return success();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return { status: "error", message: "Digite um e-mail válido." };
  }

  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!token || !domain) {
    if (!isShopifyConfigured()) {
      console.info("[newsletter] modo demonstração: inscrição recebida (não enviada à Shopify).");
      return success();
    }
    try {
      const requestHeaders = await headers();
      const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || undefined;
      return (await subscribeToNewsletter(email, ip)) ? success() : FAILED;
    } catch (error) {
      console.error("[newsletter]", error);
      return FAILED;
    }
  }

  try {
    const version = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-10";
    const response = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({
        query: /* GraphQL */ `
          mutation Subscribe($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer { id }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: {
            email,
            tags: ["newsletter"],
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
      }),
    });

    const json = (await response.json()) as {
      data?: { customerCreate?: { userErrors: { message: string }[] } };
      errors?: unknown;
    };
    const userErrors = json.data?.customerCreate?.userErrors ?? [];
    // E-mail já cadastrado não é erro para quem se inscreve (e não revela quem é cliente).
    const onlyDuplicate = userErrors.every((error) => /taken|already|existe/i.test(error.message));
    if (!response.ok || json.errors || (userErrors.length > 0 && !onlyDuplicate)) {
      console.error("[newsletter] falha na Admin API", response.status, userErrors);
      return { status: "error", message: "Não conseguimos concluir agora. Tente novamente em instantes." };
    }
    return success();
  } catch (error) {
    console.error("[newsletter]", error);
    return { status: "error", message: "Não conseguimos concluir agora. Tente novamente em instantes." };
  }
}
