import { getProducts } from "@/lib/shop";
import { isShopifyConfigured } from "@/lib/shop/config";

/**
 * Só em desenvolvimento: explica por que a vitrine está vazia logo depois de conectar a
 * Shopify (o cliente final nunca vê este aviso).
 */
export async function SetupNotice() {
  if (process.env.NODE_ENV !== "development" || !isShopifyConfigured()) return null;
  const products = await getProducts();
  if (products.length > 0) return null;

  return (
    <aside className="container-page mt-6" aria-label="Aviso de configuração (só aparece no seu computador)">
      <div className="rounded-card border-2 border-dashed border-ink/30 bg-lime/40 p-5 text-sm leading-relaxed sm:p-6">
        <p className="font-extrabold uppercase tracking-[0.08em]">✅ Site conectado à sua loja Shopify</p>
        <p className="mt-2 text-ink-soft">
          Mas a loja ainda não tem <strong className="text-ink">nenhum produto visível</strong> para o site. Importe
          produtos pelo app do fornecedor e, em <em>Produtos</em>, deixe-os disponíveis no canal{" "}
          <strong className="text-ink">Headless</strong>. Depois é só recarregar esta página.
        </p>
        <p className="mt-2 text-xs text-muted">Este aviso aparece apenas em desenvolvimento.</p>
      </div>
    </aside>
  );
}
