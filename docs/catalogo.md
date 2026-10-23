# Catálogo: como foi montado e como chegar a 100+ produtos

## Resumo

| Etapa | Itens |
| --- | --- |
| Catálogo público da SIHI (aba *Find Products*) | 3.994 |
| Parecem roupa de treino (palavras-chave + categorias) | 185 |
| Parecem acessório ou equipamento de treino (bolsas, toalhas, faixas, garrafas…) | 73 |
| Abertos no editor da SIHI para conferir fotos, cores e tamanhos (sem enviar nada) | 56 |
| Com cores/tamanhos limpos na Shopify e fotos sem marca de terceiros | **20** |
| Publicados na loja (somados aos 4 do primeiro lote) | **24** |

A própria tela da SIHI avisa que o catálogo público é "apenas para referência" e que o gerente de contas tem mais
produtos (a aba *More Products* só leva a uma tela de cadastro de conta, não a um catálogo maior). Por isso o caminho
para 100+ não é mais automação: é **pedir mais produtos** (veja o fim deste arquivo). Chegar a 100 com este catálogo
público exigiria vender itens com cores em pinyin, fotos com marca de terceiros ou moda casual que não é de treino,
o que prejudica a loja.

## Por que tantos candidatos foram descartados

O que a SIHI mostra como "Cor" e "Tamanho" vem direto do fornecedor chinês e é exatamente o que o cliente vê na
Shopify e no checkout. Foram descartados, entre outros:

- **Cores em pinyin** (fugulv, nenyalv, jingdianlv…), como em um legging/short de yoga com 85 variações.
- **Colunas trocadas** (a coluna "Cor" traz S/M/L e a coluna "Tamanho" traz Pink/Black…), como em um macaquinho fitness.
- **Tamanhos com texto do fornecedor** ("S=domestic m code", "S recommendation 37.5-45kg", "M [recommended 40 kg-50 kg]]").
- **Códigos no lugar de cores** (DK01-QK2000, Q102 [black ankle-tied]]) e variações lixo ("[color 1 pre-sale]").
- **Marca ou personagem de terceiros** nas fotos ou na estampa (anime, camisas de seleções, meias com logo famoso).
- Itens fora do tema: moda casual (polos, bermudas de linho), lingerie/modeladores, joias, casa.

### Bons produtos que ficaram de fora só por causa do nome das variações

Se a SIHI corrigir os nomes (ou você autorizar renomear as opções na Shopify depois de confirmar com eles que isso não
afeta o mapeamento dos pedidos), estes entram na hora. Os códigos são o final do ID na SIHI.

| ID SIHI (final) | O que é | Problema |
| --- | --- | --- |
| …15163136 | Short fitness canelado feminino, cintura alta (4 cores) | tamanhos "S recommendation 37.5-45kg…" |
| …89829376 | Macaquinho fitness manga curta, costas em V (6 cores) | colunas Cor/Tamanho trocadas |
| …71151872 | Camiseta esportiva feminina ajustada (5 cores) | tamanhos "S=domestic m code" e cor "Pink/pick" |
| …61477376 | Top esportivo com zíper frontal, alta sustentação (4 cores) | tamanhos com peso: "S (within 47.50kg)" |
| …32233472 | Macaquinho canelado manga longa com zíper | colunas trocadas e cores em pinyin |

## Como definimos o preço de venda

> **Revisão de 23/10/2026:** os preços foram comparados com o mercado (Amazon Brasil) e 12 dos 24 produtos estão
> abaixo do que se cobra por aí. Novos preços sugeridos em [produtos-alta-margem.md](produtos-alta-margem.md) e nas
> colunas novas de [catalogo-produtos.csv](catalogo-produtos.csv). As faixas abaixo foram o ponto de partida.

Faixas pelo custo do produto na SIHI (US$), no mesmo critério dos quatro primeiros produtos:

| Custo (US$) | Preço (R$) | | Custo (US$) | Preço (R$) |
| --- | --- | --- | --- | --- |
| até 2 | 39,90 | | 8,5 a 10,5 | 119,90 |
| 2 a 3,5 | 59,90 | | 10,5 a 14 | 139,90 |
| 3,5 a 5 | 69,90 | | 14 a 20 | 169,90 |
| 5 a 6,5 | 79,90 | | acima de 20 | 199,90 |
| 6,5 a 8,5 | 99,90 | | | |

Ajustes: conjuntos de duas peças **+ R$ 30**; moletons e jaquetas **a partir de R$ 139,90**; camisetas **no máximo
R$ 89,90**; acessórios (boné, pochete) **R$ 39,90 a R$ 59,90**.

> **Importante:** são preços de partida. Eles **não** incluem frete internacional, imposto de importação, taxa do
> gateway (Pix/cartão) nem anúncios. Confira o custo total na SIHI e ajuste. A planilha
> [catalogo-produtos.csv](catalogo-produtos.csv) traz custo, preço e a relação entre os dois para cada produto.

## Como chegar a 100+ produtos

1. **Gerente de contas da SIHI:** envie o pedido de [pedido-produtos-sihi.md](pedido-produtos-sihi.md). É grátis e é o
   caminho que a própria SIHI indica. Peça fábricas de **roupa fitness** (não o catálogo genérico do 1688).
2. **Aba Service → Sourcing** da SIHI, para pedir itens específicos a partir de um link.
3. **Mais de um fornecedor:** como o site só lê a Shopify, dá para somar um segundo app de dropshipping (veja
   [dropshipping.md](dropshipping.md)) sem mexer no código. Fornecedores nacionais de moda fitness reduzem prazo e imposto.

Quando os produtos novos chegarem, o processo para cada um é: *Publish to Store → Product Edit → Submit* na SIHI e,
na Shopify, ajustar endereço (handle), tipo, tags e descrição de SEO. Coleções automáticas por tag
(`feminino`, `masculino`, `shorts`…) já existem e recebem os produtos novos sozinhas.
