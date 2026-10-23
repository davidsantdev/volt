# VOLT — loja de roupas de academia (Next.js + Shopify)

Loja virtual *headless*: o catálogo, o carrinho, o checkout e os pedidos ficam na **Shopify**; este projeto é a
vitrine em **Next.js 16**, feita para velocidade e SEO. Os produtos vêm de fornecedores de **dropshipping** conectados
à Shopify (veja [docs/dropshipping.md](docs/dropshipping.md)).

Recursos de venda (copiados de lojas que vendem, com fontes em [docs/referencias.md](docs/referencias.md)): frete por
CEP e cupom no carrinho, guia de tamanhos, filtros, busca instantânea, amostras de cor, barra fixa de compra no
celular, zoom de foto, vistos recentemente, newsletter real e WhatsApp.

Documentação do catálogo: [como foi montado e como chegar a 100+ produtos](docs/catalogo.md) ·
[planilha de custo x preço](docs/catalogo-produtos.csv) ·
[pedido de produtos ao gerente da SIHI](docs/pedido-produtos-sihi.md) ·
[**produtos baratos para vender caro e reajuste de preços**](docs/produtos-alta-margem.md).

> **VOLT é um nome provisório.** Troque marca, textos e promessas em [src/config/site.ts](src/config/site.ts).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Sem nenhuma variável de ambiente o site abre em **modo demonstração**: produtos de exemplo (ilustrações vetoriais),
carrinho que guarda no navegador e checkout desativado. Para conectar a loja de verdade, copie `.env.example` para
`.env.local` e siga a próxima seção.

## Como o dropshipping se encaixa

```
Cliente ──► Site Next.js (este projeto) ──► Shopify Storefront API ──► Shopify
                                                                         │  catálogo · carrinho · checkout · pedidos
            app do fornecedor (DSers, CJ, Dropi…) ◄─────────────────────┘
            importa produtos, sincroniza estoque e preço, recebe cada pedido pago e envia ao cliente
```

O site **não conversa com o fornecedor**: ele só lê a Shopify. Quem envia pedidos e atualiza estoque é o **app do
fornecedor** instalado na Shopify (é a "API que passa os dados ao fornecedor" — a própria Shopify a fornece). Por isso
trocar ou somar fornecedores não exige mexer neste código.

## Conectando a Shopify

1. **Crie a loja** e instale o app do fornecedor escolhido (veja o guia de dropshipping).
2. **Token da Storefront API:** instale o canal **Headless** (Shopify App Store) → *Criar storefront* → copie o
   **token privado**. Em *Permissões da Storefront API* deixe marcado: produtos e coleções, conteúdo (menus e
   páginas) e checkout/carrinho.
3. **Variáveis** em `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br
   SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
   SHOPIFY_STOREFRONT_PRIVATE_TOKEN=...
   ```
4. **Moeda e país:** em *Configurações → Mercados*, deixe o Brasil com moeda BRL.
5. **Coleções:** crie `lancamentos` (o *handle* é o final da URL) e, quando já tiver vendas, `mais-vendidos`. As demais
   (feminino, shorts, leggings…) viram as categorias da home e do rodapé sozinhas. Dica: coleções **automáticas** por
   tag ou por tipo de produto se atualizam sozinhas. Sem `mais-vendidos`, a home mostra "Destaques" e o link some;
   sem `lancamentos`, os botões levam à vitrine geral. Nunca há link para coleção que não existe.
6. **Menu:** se você personalizar *Navegação → Menu principal* (handle `main-menu`), ele vira o menu do site. Enquanto
   estiver com os itens que a Shopify cria sozinha (Início, Catálogo, Contato), o site usa o menu de
   [src/config/site.ts](src/config/site.ts), sem os links de coleções que ainda não existem (ex.: Masculino).
7. **Páginas institucionais:** crie em *Páginas* com os handles `sobre`, `entregas`, `trocas-e-devolucoes`,
   `privacidade` e `termos` (o rodapé já aponta para eles).
8. **Pagamentos no Brasil:** a Shopify Payments não existe no Brasil; configure um gateway com Pix e cartão
   (Mercado Pago, Pagar.me, PagBank, Appmax…). Detalhes no guia de dropshipping.

## Antes de vender

O site só anuncia o que está ligado em [src/config/site.ts](src/config/site.ts), porque oferta anunciada obriga a
loja a cumprir (CDC, art. 30). Ligue cada item **depois** de configurá-lo:

| O que | Onde configurar | Depois, em `site.ts` |
| --- | --- | --- |
| Pagamento com Pix e cartão | Shopify → Configurações → Pagamentos: um gateway brasileiro (Mercado Pago, Pagar.me, PagBank, Appmax…). Sem isso o checkout não recebe. | — |
| Desconto no Pix | No gateway (ex.: "desconto para Pix") | `pixDiscount: 0.05` |
| Parcelamento sem juros | No gateway | `maxInstallments: 3` |
| "Leve 2 e ganhe 10%" | Descontos → criar desconto **automático** de porcentagem nos produtos, com quantidade mínima de 2 itens | `quantityDiscount: { minItems: 2, percent: 0.1 }` (barra do topo, página do produto e barra de progresso no carrinho) |
| Frete grátis | Configurações → Frete e entrega → taxa "Frete grátis" com pedido mínimo. Hoje a loja cobra **R$ 22 (Padrão)** para SP, inclusive em pedidos acima de R$ 299. | `freeShippingThreshold: 299` |
| Cupom de boas-vindas | Descontos → criar código (ex.: BEMVINDO10) | `newsletter: { discountLabel: "10% off", discountCode: "BEMVINDO10" }` |
| Dados da empresa | Obrigatórios para quem vende online (Decreto 7.962/2013) | `legalName`, `cnpj` |
| Atendimento | — | `contact.email`, `contact.whatsapp` (liga os botões de WhatsApp), `social` |
| Políticas | Configurações → Políticas (troca, privacidade, termos, frete), em português | Páginas `entregas`, `trocas-e-devolucoes`, `privacidade`, `termos` em Shopify → Páginas |
| Domínio | Seu domínio na hospedagem | `NEXT_PUBLIC_SITE_URL` no `.env` |

Já funcionam sem configuração extra: **frete por CEP no carrinho** (taxas reais da Shopify), **cupons** criados em
Descontos, **newsletter** (cadastra o cliente com consentimento de marketing na Shopify) e o checkout da Shopify.
Faça um pedido de teste com o gateway em modo de teste antes de divulgar a loja.

### Testando a conexão

Com o domínio e o token preenchidos no `.env.local` (esse arquivo é só do seu computador; nunca cole o token em chats
nem em mensagens), rode:

```bash
npm run check:shopify
```

Ele mostra em português o que está certo e o que falta: token, permissões do canal Headless, moeda BRL, produtos
visíveis (se aparecer **0**, libere os produtos para o canal *Headless* na Shopify), coleções e carrinho. Quando tudo
estiver ✅, rode `npm run dev` para ver a sua loja de verdade.

### Atualização instantânea (webhooks)

As páginas são estáticas e se renovam sozinhas a cada ~10 min. Para refletir preço/estoque na hora, cadastre em
*Configurações → Notificações → Webhooks* (formato JSON) os eventos `products/create`, `products/update`,
`collections/update` e `pages/update` apontando para `https://SEU-DOMINIO/api/shopify/revalidate`, e coloque o segredo
mostrado ali em `SHOPIFY_WEBHOOK_SECRET`.

### Newsletter e conta do cliente

- O formulário do rodapé cria um cliente com consentimento de marketing pela **Admin API**. Defina
  `SHOPIFY_ADMIN_ACCESS_TOKEN` (permissão `write_customers`) e crie na Shopify o cupom de `site.newsletter.discountCode`.
  Sem o token, o formulário apenas simula o sucesso.
- `NEXT_PUBLIC_ACCOUNT_URL` mostra o botão **Entrar** no cabeçalho (URL da conta de cliente da sua loja).

## SEO

Já pronto: `title`/`description`/canonical/Open Graph/Twitter por página · dados estruturados (Organization, WebSite,
Product + Offers, BreadcrumbList, CollectionPage/ItemList, FAQPage) · `sitemap.xml` dinâmico · `robots.txt` ·
`lang="pt-BR"` · HTML semântico e acessível · páginas pré-renderizadas com Cache Components (HTML pronto para o
Google, sem esperar JavaScript) · imagens AVIF/WebP · fonte otimizada · busca marcada como `noindex`.

Depois de publicar: verificar o site no **Google Search Console** (variável `GOOGLE_SITE_VERIFICATION`) e enviar
`/sitemap.xml` · ativar **Google Merchant Center** (listagens gratuitas) · escrever **descrições próprias** dos
produtos (texto copiado do fornecedor é conteúdo duplicado e rende pouco no Google) · preencher *alt text* nas fotos.

## Personalizando

| O quê | Onde |
| --- | --- |
| Nome, textos, frete grátis, Pix, CNPJ, redes, menu | [src/config/site.ts](src/config/site.ts) |
| Cores e fonte | `@theme` em [src/app/globals.css](src/app/globals.css) |
| Logo | [src/components/layout/logo.tsx](src/components/layout/logo.tsx) e `src/app/icon.svg` |
| Imagem de compartilhamento e ícones | `public/og.png` (1200×630), `public/icon-192.png`, `public/icon-512.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` |
| Fotos do topo da home, das categorias e da faixa editorial; capa de produto cuja 1ª foto é uma colagem | [src/config/merch.ts](src/config/merch.ts) |

As ilustrações em `src/components/art` existem só para o modo demonstração; com a Shopify conectada, as fotos dos
produtos aparecem no lugar.

## Estrutura

```
src/app/            rotas: home, /produtos, /colecoes, /busca, /paginas, sitemap, robots, manifest, API de webhook
src/components/     layout, home, shop (cartão, grade, página do produto), cart (gaveta), ui, seo, art
src/lib/shop/       camada de dados: shopify.ts (Storefront API), mock.ts (demo), index.ts (cache + etiquetas)
src/config/site.ts  marca e promessas da loja
```

## Antes de publicar

- Troque o CNPJ, a razão social e os contatos de exemplo; os textos de `/paginas/*` são exemplos e devem ser
  revisados por um contador/advogado (LGPD, trocas, entrega).
- Confirme que cada promessa do site é verdadeira na sua operação: frete grátis, desconto no Pix, prazo de troca.
- Ajuste os textos de **prazo e frete** (FAQ, página do produto, `/paginas/entregas`) ao prazo real do fornecedor; se o
  produto vier do exterior, deixe isso claro ao cliente.
- Faça um **pedido de teste completo** (carrinho → checkout → pagamento → pedido no fornecedor).
- Peça **amostras** dos produtos: conforto e tamanho são o que mais gera devolução em roupa de academia.

## Status da verificação

Verificado: build de produção, TypeScript e ESLint limpos; fluxo completo no navegador em modo demonstração
(carrinho, compra rápida, menu, busca, newsletter); layout em desktop e celular; as 17 consultas GraphQL do projeto
validam contra o esquema oficial da Shopify (versão 2026-10).
**Ainda não testado com uma loja Shopify real** (faltavam credenciais): o primeiro teste com a sua loja pode revelar
ajustes de permissão do token ou de configuração de mercado.
