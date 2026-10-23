# O que copiamos de lojas que vendem

Recursos que lojas de roupa de treino com muitas vendas usam e que este site já tem, com a fonte da prática. Tudo
**funciona de verdade** com a loja conectada; o que depende de configuração na Shopify fica desligado até você ligar
(veja "Antes de vender" no [README](../README.md)).

| Prática | Quem faz / fonte | Onde está no site |
| --- | --- | --- |
| Topo com fotos de modelo (no lugar de ilustração) e dois botões, Feminino e Masculino | [Gymshark](https://www.gymshark.com/), [Oner Active](https://oneractive.com/), [LIVE!](https://www.liveoficial.com.br/) (vistos em 23/10/2026) | Home; fotos escolhidas em `src/config/merch.ts` |
| Carrossel de produtos logo abaixo do topo ("New in", "Best sellers") | Gymshark, Oner Active | Home → "Destaques" (curadoria em `merch.ts` até existir a coleção "Mais vendidos") e "Acabou de chegar" |
| Categorias com foto e o nome por cima | Oner Active ("Shop by category"), LIVE! | Home, página Coleções e menu do celular |
| Card com a foto ocupando tudo, nome em letra normal e a segunda foto ao passar o mouse | Gymshark, Oner Active | Todas as listas de produtos |
| Galeria grande em grade no computador e carrossel de arrastar no celular, com as informações fixas ao lado | Gymshark | Página de produto |
| Texto curto de SEO no fim da home, com links para as categorias | Gymshark ("Workout clothes & gym clothing") | Fim da home |
| Faixa preta de newsletter no rodapé | Gymshark ("New here? Want an extra 15% off?") | Rodapé (o cupom só aparece quando existir na Shopify) |
| "Leve 2 e ganhe X%" com barra de progresso no carrinho | Prática comum para subir o valor do pedido; usa o desconto automático da Shopify | Carrinho, barra do topo e página de produto, quando `quantityDiscount` estiver ligado |
| Guia de tamanhos **ao lado** da escolha de tamanho, com "Fechar" claro; equivalência de letras e como medir | [Baymard: informação de tamanho em moda](https://baymard.com/blog/apparel-size-information) (82% das lojas informam pouco e perdem a venda), [exemplos de guias](https://baymard.com/ecommerce-design-examples/size-guide) | Página de produto → "Guia de tamanhos" |
| Um botão para cada tamanho e cor (nada de lista suspensa) | [Baymard: 5 boas práticas de moda](https://baymard.com/blog/apparel-5-best-practices) | Página de produto |
| Frete, prazo e devolução visíveis antes do checkout | [Gymshark](https://ca.gymshark.com/products/gymshark-running-t-shirt-ss-tops-grey-ss25) mostra frete grátis acima de um valor, prazo e troca; [DHL: calculadora de frete na página](https://www.dhl.com/discover/pt-br/conselhos-de-comercio-eletronico/melhores-praticas-de-comercio-eletronico/regras-de-ouro-do-e-commerce) | Carrinho → "Calcular frete" (taxas reais da Shopify pelo CEP); "Entrega e trocas" no produto |
| Pix e parcelamento configurados no gateway | [Loja Integrada](https://lojaintegrada.com.br/hub/parcelamento-via-pix/), [Shopify Brasil: vender parcelado](https://www.shopify.com/br/blog/vantagens-de-vender-parcelado) | `pixDiscount` e `maxInstallments` em `site.ts` (aparecem no preço, na barra do topo e no FAQ quando ligados) |
| Cupom no carrinho | Padrão do varejo brasileiro | Carrinho → "Tem um cupom de desconto?" (códigos de Shopify → Descontos) |
| Filtros por categoria, tamanho, cor e preço | Padrão de lojas de moda | Toda lista de produtos → "Filtrar" |
| Amostras de cor no card | Gymshark, lojas de moda | Cards de produto |
| Busca que sugere enquanto digita | Padrão de lojas grandes | Lupa do cabeçalho |
| Barra fixa de compra no celular | Padrão em lojas de moda no celular | Página de produto, ao rolar |
| Foto em tela cheia | Padrão de moda (ver tecido e caimento) | Clique na foto do produto |
| Vistos recentemente | Padrão de lojas grandes | Página de produto, no fim |
| WhatsApp para tirar dúvida | Padrão no Brasil | Botão flutuante e no guia de tamanhos, quando o número estiver em `site.ts` |
| Política de devolução no Google | Dados estruturados de produto | JSON-LD com devolução em 7 dias (direito de arrependimento) |

## O que ficou de fora de propósito

- **Avaliações de clientes:** só com avaliações reais (um app de reviews na Shopify). Nunca inventar notas.
- **"Últimas unidades" e contagem de estoque:** a SIHI não controla estoque na Shopify; o número seria falso.
- **Pop-up de cupom:** só depois que o cupom existir em Shopify → Descontos.
