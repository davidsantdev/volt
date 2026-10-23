// Testa a conexão do site com a sua loja Shopify e explica, em português, o que falta.
// Uso:  npm run check:shopify      (lê os dados do arquivo .env.local)

const clean = (value) => (value ?? "").trim();
const domain = clean(process.env.SHOPIFY_STORE_DOMAIN).replace(/^https?:\/\//, "").replace(/\/+$/, "");
const privateToken = clean(process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN);
const publicToken = clean(process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN);
const version = clean(process.env.SHOPIFY_STOREFRONT_API_VERSION) || "2026-10";
const country = clean(process.env.SHOPIFY_COUNTRY) || "BR";

const ok = (message) => console.log(`✅ ${message}`);
const warn = (message) => console.log(`⚠️  ${message}`);
const fail = (message) => {
  console.log(`❌ ${message}`);
  process.exitCode = 1;
};

if (!domain || (!privateToken && !publicToken)) {
  fail("Faltam dados no arquivo .env.local.");
  console.log("   Preencha SHOPIFY_STORE_DOMAIN (ex.: minha-loja.myshopify.com) e SHOPIFY_STOREFRONT_PRIVATE_TOKEN.");
  console.log("   O passo a passo está no README.md (seção “Conectando a Shopify”).");
  process.exit(1);
}

if (!/\.myshopify\.com$/i.test(domain)) {
  warn(`O endereço "${domain}" não termina com .myshopify.com. Use o endereço interno da loja (Configurações → Domínios).`);
}

class ApiError extends Error {}

async function call(query, variables = {}) {
  const headers = { "Content-Type": "application/json" };
  if (privateToken) headers["Shopify-Storefront-Private-Token"] = privateToken;
  else headers["X-Shopify-Storefront-Access-Token"] = publicToken;

  let response;
  try {
    response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new ApiError(`Não consegui falar com ${domain}. Confira o endereço e a sua internet.`);
  }

  if (response.status === 401 || response.status === 403) {
    throw new ApiError("A Shopify recusou o token. Copie de novo o token PRIVADO do canal Headless (sem espaços).");
  }
  if (response.status === 404) {
    throw new ApiError(`A loja "${domain}" não foi encontrada. Confira o endereço .myshopify.com.`);
  }
  if (!response.ok) throw new ApiError(`A Shopify respondeu com erro HTTP ${response.status}.`);

  const json = await response.json();
  return json;
}

const permissionHint = (errors) =>
  errors.some((error) => error.extensions?.code === "ACCESS_DENIED" || /access denied|not approved/i.test(error.message));

async function main() {
  console.log(`\nTestando ${domain} (API ${version}, país ${country})…\n`);

  // 1) Loja e moeda
  const shopResult = await call(`{ shop { name primaryDomain { url } paymentSettings { currencyCode } } }`);
  if (shopResult.errors || !shopResult.data?.shop) {
    throw new ApiError("Não consegui ler os dados da loja. Confira o token e as permissões do canal Headless.");
  }
  const shop = shopResult.data.shop;
  ok(`Conectado à loja “${shop.name}” (${shop.primaryDomain.url}).`);
  const storeCurrency = shop.paymentSettings.currencyCode;
  if (storeCurrency === "BRL") ok("Moeda da loja: Real brasileiro (BRL).");
  else warn(`A moeda da loja é ${storeCurrency}. Para vender no Brasil, ajuste em Configurações → Mercados (Brasil / BRL).`);

  // 2) Produtos
  const productsResult = await call(
    `query($country: CountryCode) @inContext(country: $country) {
      products(first: 50) { nodes { title availableForSale priceRange { minVariantPrice { amount currencyCode } } } }
    }`,
    { country },
  );
  if (productsResult.errors) {
    fail(
      permissionHint(productsResult.errors)
        ? "O token não pode ler produtos. No canal Headless, em Permissões da Storefront API, marque a leitura de produtos e coleções."
        : `Erro ao ler produtos: ${productsResult.errors[0].message}`,
    );
  } else {
    const products = productsResult.data.products.nodes;
    if (products.length === 0) {
      warn("Nenhum produto visível para o site. Na Shopify, abra os produtos e libere-os para o canal “Headless”.");
    } else {
      const first = products[0];
      ok(`${products.length} produto(s) visível(is). Exemplo: ${first.title} — ${first.priceRange.minVariantPrice.amount} ${first.priceRange.minVariantPrice.currencyCode}.`);
      if (first.priceRange.minVariantPrice.currencyCode !== "BRL") {
        warn("Os preços não estão em BRL. Confira Configurações → Mercados (Brasil com moeda BRL).");
      }
    }
  }

  // 3) Coleções especiais
  const collectionsResult = await call(`{ collections(first: 50) { nodes { handle title } } }`);
  if (!collectionsResult.errors) {
    const handles = collectionsResult.data.collections.nodes.map((node) => node.handle);
    ok(`${handles.length} coleção(ões) encontrada(s).`);
    for (const special of ["mais-vendidos", "lancamentos"]) {
      if (!handles.includes(special)) {
        warn(`Falta a coleção “${special}” (opcional). Sem ela, a home usa os produtos em ordem automática.`);
      }
    }
  }

  // 4) Carrinho (é o que permite finalizar a compra)
  const cartResult = await call(`mutation { cartCreate(input: {}) { cart { id } userErrors { message } } }`);
  if (cartResult.errors) {
    fail(
      permissionHint(cartResult.errors)
        ? "O token não pode criar carrinhos. No canal Headless, em Permissões da Storefront API, marque “checkouts” (ler e gravar)."
        : `Erro ao criar carrinho: ${cartResult.errors[0].message}`,
    );
  } else {
    ok("Carrinho e checkout liberados.");
  }

  // 5) Menu e páginas (opcionais)
  const contentResult = await call(`{ menu(handle: "main-menu") { items { title } } }`);
  if (contentResult.errors) {
    warn("Sem permissão para ler menus e páginas (opcional). O site usa o menu padrão e as páginas de exemplo.");
  } else {
    ok("Menus e páginas liberados.");
  }

  console.log(
    process.exitCode
      ? "\nCorrija os itens ❌ acima e rode de novo:  npm run check:shopify\n"
      : "\nTudo certo. Rode  npm run dev  e abra http://localhost:3000 para ver a sua loja de verdade.\n",
  );
}

main().catch((error) => {
  fail(error instanceof ApiError ? error.message : `Erro inesperado: ${error.message}`);
  console.log("\nRode de novo depois de corrigir:  npm run check:shopify\n");
});
