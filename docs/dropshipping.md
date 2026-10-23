# Dropshipping + Shopify: como funciona e qual fornecedor escolher

Pesquisa feita em outubro de 2026. Muitas fontes são blogs de empresas do setor, então **confirme preços, prazos e
integrações diretamente com cada fornecedor** antes de fechar.

## Como a integração funciona (sem código)

1. Você instala o **app do fornecedor** na Shopify.
2. O app importa os produtos para a sua loja e mantém **estoque e preço** sincronizados.
3. Quando um cliente paga, a Shopify avisa o app, que **envia o pedido ao fornecedor** e devolve o código de rastreio.

O site Next.js não participa disso: ele só lê o catálogo da Shopify pela Storefront API.

## SIHI (o fornecedor em que você abriu conta)

O que as fontes públicas dizem (outubro de 2026, **confirme tudo com a SIHI**):

- Fornecedor de dropshipping **internacional**, com app oficial na Shopify chamado **"SIHI Dropshipping Fulfillment"**
  (nota 4,3 com 75 avaliações: maioria 5 estrelas, mas há queixas de produto errado e de pedido parado sem coleta).
- A instalação é grátis; as cobranças são **em dólar**, feitas quando o pedido é enviado, e a página avisa que "pode
  haver cobranças adicionais".
- **Origem e prazo divergem**: o site em português fala em 3 a 7 dias; o app lista Brasil, China e EUA como origens;
  outros textos falam em 7 a 15 dias saindo da China; um lojista relata cerca de 2 semanas.
- Não encontrei: se há **catálogo de moda fitness** (na Shopify o app aparece na categoria "Business and office"),
  quem paga **imposto de importação**, como fica a **nota fiscal** e qual é a **política de devolução**.
- O app pede permissões amplas na loja (clientes, produtos, pedidos…). É comum nesse tipo de app, mas instale só o
  oficial, pela Shopify App Store.
- **Cuidado com sites parecidos**: o endereço `sihibrasil.com.br` abriu com o certificado de outro domínio
  (`jozodrop.com`); não use. Os endereços que aparecem nas páginas oficiais do app são `sihi.com.br` e
  `app.sihidropshipping.com`.

Perguntas para mandar ao suporte da SIHI (a página do app deles na Nuvemshop indica `suporte@sihi.com.br`):

1. Vocês têm roupas de academia (legging, top, shorts, regata)? Qual a composição do tecido de cada uma?
2. De onde sai cada produto (China, EUA ou Brasil) e qual é o prazo **real** até o Brasil?
3. Quem paga imposto de importação e ICMS? O frete cotado já inclui? Como fica a nota fiscal?
4. Posso pedir **amostra**? Quanto custa e como pago (cartão internacional)?
5. Dá para ter embalagem com a minha marca? Qual o custo e o mínimo?
6. Como funciona troca e devolução, e o que acontece se vier produto errado ou danificado?
7. Existe alguma cobrança além do produto e do frete?

Como começar (o passo a passo exato pode variar, siga os tutoriais da Central de Ajuda deles):

1. Na Shopify: *Aplicativos → Shopify App Store →* procure **SIHI Dropshipping Fulfillment** → *Instalar* e autorize.
2. Entre na plataforma da SIHI e confirme que a conexão com a sua loja aparece como ativa.
3. Procure 3 a 5 produtos de academia e importe para a loja (em inglês costuma achar mais: *leggings, sports bra,
   gym shorts, tank top*).
4. **Faça um pedido para você mesmo** antes de vender: veja tecido, tamanho, transparência, embalagem e prazo real.

## Opções para roupa de academia no Brasil

| Opção | O que é | Integra com a Shopify? | Pontos de atenção |
| --- | --- | --- | --- |
| **Dropi / DropNacional** | Hub que conecta lojas a fornecedores nacionais | Sim, segundo a página de planos (Shopify, Nuvemshop, Yampi, Wix…) | Plano grátis só dá acesso a AliExpress; fornecedores nacionais a partir do plano pago (R$ 59/mês no Nível 1, segundo a página consultada) |
| **Fábricas nacionais de moda fitness** (Kaisan, Racy Modas, Protocolo Modas) | Produzem e vendem no atacado | **Não confirmado** | Kaisan cita pedido mínimo mensal (R$ 350–400, as fontes divergem); confirme se enviam direto ao seu cliente e se têm API/integração |
| **CJ Dropshipping** | Catálogo grande, app na Shopify, personalização de produto e embalagem | Sim (app oficial) | Cita armazém no Brasil, mas a fonte é um post de 2020 da própria CJ: confirme o catálogo e o prazo atuais; qualidade varia por produto |
| **DSers / AliExpress** | Maior catálogo do mundo | Sim | Prazo longo e tributação na importação; difícil garantir conforto e padrão |
| **Impressão sob demanda nacional** (Montink, Dimona, Gubo, Uma Penca, Reserva INK) | Produzem peças estampadas com a sua arte | Montink, Gubo e Dimona citam a Shopify | Só peças estampadas (camisetas, regatas de algodão); não servem para legging/compressão |
| **Hubs com ERP** (DSlite, Drophar) | Conectam fornecedores a ERPs e lojas | Não citam a Shopify | Drophar cobra 8% por venda e exige CNPJ |

## Recomendação

Para "melhor design e o máximo de conforto":

1. **Comece com fornecedor nacional** (via DropNacional ou direto com uma fábrica fitness). Entrega mais rápida, sem
   imposto de importação e troca mais simples, o que pesa muito na conversão e na reputação.
2. **Peça amostra física de cada peça** antes de vender: composição do tecido, transparência (teste de agachamento),
   costuras, tabela de medidas real. Conforto é o item mais difícil de garantir em dropshipping.
3. Use **CJ** (armazém no Brasil, se confirmado) para complementar com acessórios e itens de catálogo amplo.
4. Deixe **AliExpress/DSers** só para testar demanda de itens baratos, avisando o prazo na página do produto.
5. Para uma linha com a **sua marca**, avalie fábrica nacional com etiqueta própria ou impressão sob demanda.

### Perguntas para fazer ao fornecedor

- Envia direto ao meu cliente, com embalagem neutra (sem a marca do fornecedor)?
- Emite nota fiscal? Em nome de quem?
- Qual o prazo de postagem e a transportadora? Como é o rastreio?
- Existe app/integração com Shopify (estoque e pedidos automáticos) ou o pedido é manual/planilha?
- Quem paga o frete de troca e devolução? Qual a política de defeito?
- Há pedido mínimo, mensalidade ou comissão?

## Impostos na importação (se vier de fora)

As fontes divergem e a regra mudou em 2026. Em resumo: o **ICMS (17% a 20%, conforme o estado)** continua valendo; o
imposto de importação para compras de até US$ 50 em sites certificados no **Remessa Conforme** passou a ser zero desde
12/05/2026 (antes era 20%), e acima disso é 60% com dedução. **Confirme com a Receita Federal e com um contador**: é um
dos motivos para preferir fornecedor nacional.

## Pagamentos no Brasil

A **Shopify Payments não está disponível para lojistas brasileiros** (segundo guias especializados; não há anúncio
recente em contrário). Use um gateway externo com **Pix** e cartão (Mercado Pago, Pagar.me, PagBank, Appmax; OpenPix
para Pix). Ao usar gateway externo a Shopify cobra uma taxa de transação adicional (2% no plano Basic, segundo um dos
guias): considere no preço.

## Fontes

- [Shopify: fornecedores de roupas para dropshipping](https://www.shopify.com/br/blog/fornecedores-de-roupas-para-dropshipping)
- [Empreender: fornecedores de dropshipping nacional](https://empreender.com.br/fornecedores-de-dropshipping-nacional-6-opcoes-com-estoque-no-brasil/)
- [Fornecedores de Confiança: dropshipping de roupas](https://blog.fornecedoresdeconfianca.com.br/fornecedores-para-dropshipping-de-roupas-opcoes-confiaveis/)
- [JivoChat: fornecedores de dropshipping 2026](https://www.jivochat.com.br/blog/vendas/fornecedores-dropshipping.html)
- [CJdropshipping na Shopify App Store](https://apps.shopify.com/cucheng) e [avaliação de fornecedores no Brasil](https://dodropshipping.com/best-dropshipping-suppliers-in-brazil/)
- [Shopify Payments no Brasil (Base)](https://base.com/pt-BR/blog/shopify-pagamentos-brasil/) e [Pix, boleto e entrada no Brasil (EasySell)](https://easysellapp.com/blogs/wiki/brazil-ecommerce-shopify-market-entry-2026)
- [Remessa Conforme (DHL)](https://www.dhl.com/discover/pt-br/assuntos-regulatorios/remessa-conforme), [Yav: tributação cross-border 2026](https://yav.com.br/blog/cross-border-tributacao-2026/), [Econet](https://blog.econeteditora.com.br/?p=30507)
- [Shopify: Storefront API (autenticação)](https://shopify.dev/docs/api/storefront) e [canal Headless](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started)
