# Produtos baratos para vender caro

Pesquisa de 23/10/2026 para a loja VOLT: o que comprar barato no fornecedor e vender com margem alta, e quanto
cobrar pelos 24 produtos que já estão na loja. Planilhas: [produtos-novos.csv](produtos-novos.csv) e
[catalogo-produtos.csv](catalogo-produtos.csv) (agora com o preço de mercado e o preço sugerido).

## Resumo

- **Comece por estes cinco** (sobra de R$ 82 a R$ 113 por venda, antes do frete e do anúncio): joelheira de
  compressão 7 mm (custa ~R$ 46, vende por R$ 149,90), cinto para hip thrust (R$ 31 → R$ 129,90), Kit Glúteo
  (R$ 73 → R$ 199,90), legging empina-bumbum sem costura (R$ 38 → R$ 129,90) e calça jogger masculina
  (R$ 38 → R$ 129,90), que reforça a linha masculina. Joelheira e cinto ficam abaixo do p75 do mercado; legging e calça
  ficam um pouco acima dele, no preço de marcas como Lupo e MXD Conceito.
- **Suba o preço de 12 dos 24 produtos atuais**, que estão abaixo do p75 do mercado: bolsa tote de R$ 59,90 para
  R$ 99,90, colete de hidratação de R$ 89,90 para R$ 149,90, boné de R$ 49,90 para R$ 79,90 e outros nove (tabela
  abaixo). Os outros 12 já estão acima do mercado: manter.
- **Não venda sozinho** o que os marketplaces vendem a preço de banana (miniband a R$ 6, corda de pular a R$ 7,50,
  hand grip a R$ 13,99, luva a R$ 19,90): use como complemento no carrinho ou dentro de um kit.

## Como a pesquisa foi feita

- **Preço de mercado:** 61 buscas na Amazon Brasil, com os 30 primeiros resultados de cada e o selo "mais de X
  compras no mês passado" (quando a Amazon mostra). Nas tabelas, *p25 · mediana · p75* quer dizer: um quarto dos
  anúncios custa menos que o p25, metade custa menos que a mediana e três quartos custam menos que o p75. Vender perto
  do p75 é cobrar caro sem sair do mercado.
- **Custo:** 40 buscas no AliExpress Brasil (preços em reais), ordenadas por número de pedidos. O custo usado é o do
  anúncio mais vendido que é de fato o produto, não o mais barato (o preço mais baixo de um anúncio quase sempre é a
  variação "isca"). Na SIHI (fábricas do 1688) o produto costuma sair mais barato, mas o frete é cotado à parte.
- **Sobra por venda:** preço − 7% de taxas (cartão ~5% no gateway + 2% da Shopify por usar gateway externo no plano
  Basic) − custo. É o que sobra **antes** do frete internacional (quando não está incluso no custo) e do anúncio.
  **Pior caso:** o mesmo cálculo com 20% de ICMS somado ao custo. No Remessa Conforme, o AliExpress cobra o ICMS na
  compra; confira no checkout se ele já está no preço do anúncio.
- **Limites:** Mercado Livre, Shopee, Magalu e Centauro bloqueiam a leitura automática. Na Amazon a roupa fitness
  vende pouco (as brasileiras compram moda fitness na Shopee, no Instagram e em lojas próprias), então, para roupas,
  o número serve de referência de preço, não de volume. Preços mudam todo dia: confira antes de cadastrar.

## A conta que faz o preço alto funcionar

1. **Sobra mínima de R$ 40 por pedido.** É o que paga o anúncio enquanto você não mede o seu custo por venda real;
   abaixo disso, o produto entra só como complemento.
2. **Ticket alto com kit e "Leve 2".** O site já mostra "Leve mais 1 peça e ganhe 10%" no carrinho: crie o desconto
   automático na Shopify e ligue `quantityDiscount` em `src/config/site.ts` (README → "Antes de vender").
3. **Frete grátis acima de R$ 199**, pago com a margem dos kits e das roupas: crie a taxa na Shopify e ligue
   `freeShippingThreshold`.
4. **Cara de marca:** foto com modelo, tabela de medidas e descrição que fala do benefício. Preço alto com foto de
   fornecedor e texto genérico não converte; o novo visual da loja ajuda, mas peça fotos boas ao fornecedor.

## Produtos novos

| Produto | Custo* | Preço sugerido | Sobra** | Mercado (Amazon: p25 · mediana · p75) | Por quê / atenção |
| --- | --- | --- | --- | --- | --- |
| **Acessórios técnicos** | | | | | |
| Joelheira de compressão 7 mm (par) | R$ 46,42 | **R$ 149,90** | R$ 92,99 (62%) · pior caso R$ 83,70 | R$ 114,13 · R$ 142,40 · R$ 177,90 | A PROGNE (7 mm) custa R$ 142–153 na Amazon; um par bem avaliado sai por ~R$ 46. Exige tabela de medidas (P a GG). |
| Cinto para hip thrust (glúteo) | R$ 31,09 | **R$ 129,90** | R$ 89,72 (69%) · pior caso R$ 83,50 | R$ 70,49 · R$ 79,99 · R$ 159,53 | Cinto de impulso para treino de glúteo; na Amazon custa de R$ 75 a R$ 160. |
| Cinto de musculação lombar 15 cm | R$ 59,58 | **R$ 169,90** | R$ 98,43 (58%) · pior caso R$ 86,51 | R$ 71,15 · R$ 179,82 · R$ 251,00 | Metade dos anúncios da Amazon custa mais de R$ 180; é mais pesado (frete internacional maior). |
| Protetor de barra para agachamento e hip thrust | R$ 37,19 | **R$ 89,90** | R$ 46,42 (52%) · pior caso R$ 38,98 | R$ 46,45 · R$ 78,83 · R$ 122,09 | Combina com o cinto de hip thrust; espuma é leve, mas a caixa é comprida. |
| Kit 3 faixas elásticas de tecido (hip band) | R$ 16,89 | **R$ 69,90** | R$ 48,12 (69%) · pior caso R$ 44,74 | R$ 24,90 · R$ 29,90 · R$ 38,90 | Acima do p75 (genéricas a R$ 19–39), mas abaixo da Vollo (R$ 104,90): venda com bolsinha e guia de exercícios, ou no Kit Glúteo. |
| Tornozeleira para polia (par) | R$ 25,29 | **R$ 69,90** | R$ 39,72 (57%) · pior caso R$ 34,66 | R$ 42,56 · R$ 55,00 · R$ 66,40 | Peça de treino de glúteo; mediana de R$ 55 na Amazon. |
| Strap com munhequeira acolchoada (par) | R$ 18,52 | **R$ 59,90** | R$ 37,19 (62%) · pior caso R$ 33,48 | R$ 24,90 · R$ 34,50 · R$ 66,40 | Alto volume (10 mil vendidos no AliExpress), mas é barato no mercado: melhor dentro de kit. |
| **Roupas** | | | | | |
| Legging empina-bumbum sem costura | R$ 37,99 | **R$ 129,90** | R$ 82,82 (64%) · pior caso R$ 75,22 | R$ 39,90 · R$ 50,79 · R$ 125,30 | A Lupo vende a R$ 125–150 na Amazon; o custo das mais vendidas é ~R$ 38. |
| Conjunto sem costura top + legging | R$ 85,19 | **R$ 169,90** | R$ 72,82 (43%) · pior caso R$ 55,78 | R$ 56,99 · R$ 94,05 · R$ 102,50 | Acima do p75 (a PUMA cobra R$ 139): preço de marca, só com amostra aprovada e boas fotos. Transparência é o maior risco. |
| Macaquinho fitness | R$ 47,89 | **R$ 119,90** | R$ 63,62 (53%) · pior caso R$ 54,04 | R$ 43,22 · R$ 66,49 · R$ 85,40 | Acima do p75 (a Elite cobra R$ 95): capriche na foto e no guia de medidas. |
| Short empina-bumbum sem costura | R$ 36,63 | **R$ 79,90** | R$ 37,68 (47%) · pior caso R$ 30,35 | R$ 19,99 · R$ 38,90 · R$ 47,49 | Sozinho sobra pouco: venda no 'Leve 2' com a legging e o top (mesma fábrica = mesmas cores). ElementFit cobra R$ 64. |
| Short-saia de treino (saia com short) | R$ 36,29 | **R$ 89,90** | R$ 47,32 (53%) · pior caso R$ 40,06 | R$ 42,65 · R$ 56,99 · R$ 75,04 | A Selene cobra R$ 57–76; combina com o top no 'Leve 2'. |
| Top com bojo removível | R$ 30,97 | **R$ 79,90** | R$ 43,34 (54%) · pior caso R$ 37,14 | R$ 39,99 · R$ 47,40 · R$ 53,19 | Acima do p75 (a PUMA cobra R$ 57): melhor no 'Leve 2' com a legging. Alto volume (10 mil vendidos). |
| Bermuda 2 em 1 masculina (com compressão por dentro) | R$ 42,88 | **R$ 119,90** | R$ 68,63 (57%) · pior caso R$ 60,05 | R$ 47,40 · R$ 66,41 · R$ 101,76 | Ripoll/NAIF cobram R$ 100–123; ótima para a linha masculina, que tem poucas peças. |
| Calça jogger masculina de treino | R$ 38,49 | **R$ 129,90** | R$ 82,32 (63%) · pior caso R$ 74,62 | R$ 42,65 · R$ 74,95 · R$ 101,55 | 10 mil vendidos no AliExpress; MXD Conceito vende a R$ 71–133. |
| Camisa de compressão manga longa masculina | R$ 38,81 | **R$ 99,90** | R$ 54,10 (54%) · pior caso R$ 46,33 | R$ 43,58 · R$ 75,04 · R$ 104,14 | Penalty a R$ 63 e Lupo a R$ 152; custo ~R$ 39. |
| Regata cavada masculina | R$ 24,59 | **R$ 69,90** | R$ 40,42 (58%) · pior caso R$ 35,50 | R$ 44,64 · R$ 53,31 · R$ 69,34 | Clássico de academia masculina; MXD Conceito cobra R$ 45–111. |
| Camiseta oversized masculina (algodão pesado) | R$ 53,42 | **R$ 119,90** | R$ 58,09 (48%) · pior caso R$ 47,40 | R$ 47,49 · R$ 71,15 · R$ 128,23 | Estilo 'gym wear' das marcas grandes; algodão 300 g é o que dá a sensação de qualidade. |

\* Custo de 1 unidade no anúncio de referência do AliExpress (links no fim). Confira no checkout do fornecedor se o
frete e o ICMS estão inclusos.
\*\* Preço − 7% de taxas − custo, antes do frete e do anúncio. "Pior caso" soma 20% de ICMS ao custo.

### Kits

O preço do kit é menor que a soma dos itens vendidos separadamente **na própria loja**, então a economia é real e
pode ser anunciada. Cadastre os itens avulsos com esses preços antes de vender o kit.

| Kit | Custo* | Separado na loja | Preço do kit | Sobra** |
| --- | --- | --- | --- | --- |
| Kit Glúteo: 3 faixas de tecido + tornozeleira de polia + cinto de hip thrust | R$ 73,27 | R$ 269,70 | **R$ 199,90** (economia real de R$ 69,80) | R$ 112,64 (56%) · pior caso R$ 97,98 |
| Kit Pegada: strap acolchoado + luva + munhequeira (par) | R$ 57,14 | R$ 159,70 | **R$ 119,90** (economia real de R$ 39,80) | R$ 54,37 (45%) · pior caso R$ 42,94 |

Na Shopify o kit é um produto próprio. Confirme com o fornecedor se ele envia as peças juntas: se cada uma sair de um
armazém, são vários fretes.

### Complementos ("leve junto")

Baratos demais no mercado para pagar anúncio sozinhos, mas bons para aumentar o pedido de quem já está comprando e
para completar o "Leve 2".

| Complemento | Custo* | Preço | Sobra** | Mercado (Amazon: mediana · compras/mês) |
| --- | --- | --- | --- | --- |
| Meias de cano alto (kit 5 pares) | R$ 26,13 | R$ 69,90 | R$ 38,88 · pior caso R$ 33,65 | R$ 44,64 · 4050 |
| Luva de academia | R$ 17,34 | R$ 49,90 | R$ 29,07 · pior caso R$ 25,60 | R$ 22,90 · 2600 |
| Toalha de microfibra | R$ 13,81 | R$ 39,90 | R$ 23,30 · pior caso R$ 20,54 | R$ 38,94 · 900 |
| Faixa de cabelo esportiva | R$ 11,89 | R$ 29,90 | R$ 15,92 · pior caso R$ 13,54 | R$ 33,48 · 500 |
| Coqueteleira com compartimentos | R$ 20,03 | R$ 39,90 | R$ 17,08 · pior caso R$ 13,07 | R$ 30,95 · 3550 |

## O que evitar

| Produto | Por quê |
| --- | --- |
| Miniband de látex e kit de elásticos com alça | O kit de 5 minibands mais vendido da Amazon custa R$ 6 (mais de 5 mil compras no mês). Impossível cobrar caro. |
| Hand grip, corda de pular e pochete simples | Medianas de R$ 17,61, R$ 29,90 e R$ 22,90; os mais vendidos custam R$ 13,99, R$ 7,50 e R$ 14,90. |
| Tapete de yoga, caneleira de peso, rolo de espuma, garrafa de 2 L | Pesados ou volumosos: o frete internacional come a margem. Só com fornecedor nacional. |
| Massageador (pistola) | Ticket alto, mas tem bateria (restrição no frete aéreo) e pede garantia e assistência; o mais vendido da Amazon custa R$ 33,56. Só com fornecedor nacional e nota fiscal. |
| Corretor postural | Promessa de saúde e preço baixo no mercado (o mais vendido sai a R$ 24,99). |

## Reajuste dos 24 produtos atuais

Regra: abaixo do p75 do mercado, sobe até perto dele, sem passar; já acima do p75, mantém. "Custo SIHI" é o preço do
produto no fornecedor convertido a ~R$ 5,50 por dólar, **sem frete**.

| Produto | Custo SIHI | Preço atual | Mercado (Amazon: p25 · mediana · p75) | Novo preço | Situação |
| --- | --- | --- | --- | --- | --- |
| Regata Feminina Gola Quadrada Básica | R$ 17,16 | R$ 59,90 | R$ 30,30 · R$ 54,98 · R$ 89,90 | **R$ 69,90** | subir (+R$ 10,00) |
| Short Ciclista Fitness Feminino Cintura Alta | R$ 43,95 | R$ 99,90 | R$ 33,24 · R$ 46,54 · R$ 65,45 | **R$ 99,90** | manter: já acima do mercado |
| Jaqueta Fitness Feminina com Zíper Manga Longa | R$ 37,34 | R$ 139,90 | R$ 44,79 · R$ 63,08 · R$ 76,92 | **R$ 139,90** | manter: já acima do mercado |
| Camiseta Fitness Feminina Slim Manga Curta | R$ 38,45 | R$ 79,90 | R$ 33,71 · R$ 51,29 · R$ 58,89 | **R$ 79,90** | manter: já acima do mercado |
| Bolsa de Academia e Viagem em Couro Sintético com Alça de Ombro | R$ 45,27 | R$ 119,90 | R$ 113,90 · R$ 135,09 · R$ 170,22 | **R$ 149,90** | subir (+R$ 30,00) |
| Bolsa Tote de Lona para Yoga e Pilates com Alça para Tapete | R$ 14,52 | R$ 59,90 | R$ 85,40 · R$ 132,05 · R$ 171,00 | **R$ 99,90** | subir (+R$ 40,00) |
| Boné Esportivo Perfurado Secagem Rápida | R$ 16,72 | R$ 49,90 | R$ 57,95 · R$ 75,99 · R$ 129,90 | **R$ 79,90** | subir (+R$ 30,00) |
| Camiseta Esportiva Masculina Modal Secagem Rápida | R$ 37,95 | R$ 89,90 | R$ 38,32 · R$ 56,98 · R$ 66,49 | **R$ 89,90** | manter: já acima do mercado |
| Camiseta Masculina Manga Longa Meio Zíper Esportiva | R$ 45,32 | R$ 89,90 | R$ 71,24 · R$ 86,89 · R$ 149,86 | **R$ 119,90** | subir (+R$ 30,00) |
| Colete de Corrida Mochila de Hidratação Ultraleve | R$ 31,24 | R$ 89,90 | R$ 66,41 · R$ 166,44 · R$ 238,50 | **R$ 149,90** | subir (+R$ 60,00) |
| Conjunto Esportivo Feminino Casaco Gola Alta e Calça Pantalona | R$ 64,73 | R$ 169,90 | R$ 76,00 · R$ 113,90 · R$ 139,90 | **R$ 169,90** | manter: já acima do mercado |
| Conjunto Feminino Casaco com Botões e Calça Pantalona | R$ 55,28 | R$ 149,90 | R$ 76,00 · R$ 113,90 · R$ 139,90 | **R$ 149,90** | manter: já acima do mercado |
| Conjunto Feminino Casaco Cropped com Capuz e Calça Pantalona | R$ 55,77 | R$ 149,90 | R$ 76,00 · R$ 113,90 · R$ 139,90 | **R$ 149,90** | manter: já acima do mercado |
| Conjunto Fitness Feminino Top Manga Longa e Legging | R$ 37,95 | R$ 129,90 | R$ 46,45 · R$ 90,24 · R$ 119,61 | **R$ 129,90** | manter: já acima do mercado |
| Conjunto Moletom Feminino Casaco com Capuz e Calça Jogger | R$ 33,44 | R$ 109,90 | R$ 92,65 · R$ 124,45 · R$ 137,75 | **R$ 129,90** | subir (+R$ 20,00) |
| Jaqueta Esportiva Masculina com Zíper e Gola Alta | R$ 45,43 | R$ 139,90 | R$ 54,05 · R$ 56,90 · R$ 80,65 | **R$ 139,90** | manter: já acima do mercado |
| Moletom Feminino Cropped com Zíper e Capuz | R$ 44,60 | R$ 139,90 | R$ 61,43 · R$ 163,49 · R$ 191,83 | **R$ 169,90** | subir (+R$ 30,00) |
| Moletom Feminino com Zíper e Capuz Preto | R$ 66,39 | R$ 159,90 | R$ 78,90 · R$ 146,60 · R$ 200,94 | **R$ 179,90** | subir (+R$ 20,00) |
| Moletom Masculino com Zíper e Capuz | R$ 35,75 | R$ 139,90 | R$ 66,63 · R$ 121,19 · R$ 293,40 | **R$ 159,90** | subir (+R$ 20,00) |
| Pochete de Corrida Porta-Celular com Cinto Ajustável | R$ 11,11 | R$ 49,90 | R$ 14,90 · R$ 22,90 · R$ 28,79 | **R$ 49,90** | manter: já acima do mercado |
| Pochete Esportiva Tecido Oxford para Celular | R$ 11,00 | R$ 39,90 | R$ 14,90 · R$ 22,90 · R$ 28,79 | **R$ 39,90** | manter: já acima do mercado |
| Short Esportivo Feminino Cintura Alta com Cordão | R$ 14,74 | R$ 59,90 | R$ 33,24 · R$ 39,90 · R$ 47,49 | **R$ 59,90** | manter: já acima do mercado |
| Top Esportivo Feminino Costas Nadador Alta Sustentação | R$ 22,27 | R$ 69,90 | R$ 47,49 · R$ 68,39 · R$ 87,33 | **R$ 79,90** | subir (+R$ 10,00) |
| Top de Yoga Feminino Alça Única Assimétrica | R$ 9,57 | R$ 39,90 | R$ 29,99 · R$ 39,80 · R$ 56,90 | **R$ 54,90** | subir (+R$ 15,00) |

Soma de uma unidade de cada: R$ 2.427,60 hoje → R$ 2.742,60 com os novos preços (+13%).

Os produtos "acima do mercado" vendem se a foto e a descrição justificarem o preço. Se não venderem em duas ou três
semanas de anúncio, teste o preço da mediana.

Os preços mudam no painel da Shopify (*Produtos → produto → Preço*). Se preferir, eu faço pela mesma automação usada
na importação, quando você abrir a janela do Edge com o login (passo a passo em
`Documents\drop-importador\README.md`).

## Como colocar os produtos novos na loja

1. **SIHI → Service → Sourcing:** mande os links de referência abaixo e peça o mesmo item de fábrica, com as
   exigências de [pedido-produtos-sihi.md](pedido-produtos-sihi.md) (fotos sem marca, cores em inglês padrão,
   tamanhos em letras e tabela de medidas). É o caminho que já está integrado à loja.
2. **Sem esperar a SIHI:** o DSers (app oficial do AliExpress para a Shopify, com plano grátis) importa pelo link do
   anúncio. O site não precisa de nenhuma mudança: ele só lê a Shopify.
3. **Peça amostra antes de anunciar** legging, conjunto e macaquinho (teste de agachamento contra a luz) e a joelheira
   (medida real).
4. **Na Shopify**, use as tags das coleções que já existem (`feminino`, `masculino`, `shorts`, `conjuntos`…) e crie a
   coleção automática **Acessórios de treino** (tag `acessorios-treino`) para joelheira, cintos, faixas e straps. Ela
   aparece sozinha nas categorias da home, no menu de atalhos e no rodapé.

### Anúncios de referência (AliExpress, 23/10/2026)

| Produto | Anúncio de referência | Preço lá | Vendidos |
| --- | --- | --- | --- |
| Joelheira de compressão 7 mm (par) | [1005005538116235](https://pt.aliexpress.com/item/1005005538116235.html) | R$ 46,42 | 700+ |
| Cinto para hip thrust (glúteo) | [1005007502107203](https://pt.aliexpress.com/item/1005007502107203.html) | R$ 31,09 | 96+ |
| Cinto de musculação lombar 15 cm | [1005007455901907](https://pt.aliexpress.com/item/1005007455901907.html) | R$ 59,58 | 800+ |
| Protetor de barra para agachamento e hip thrust | [1005005861109735](https://pt.aliexpress.com/item/1005005861109735.html) | R$ 37,19 | 2.000+ |
| Kit 3 faixas elásticas de tecido (hip band) | [1005008999724657](https://pt.aliexpress.com/item/1005008999724657.html) | R$ 16,89 | 2.000+ |
| Tornozeleira para polia (par) | [1005008777248600](https://pt.aliexpress.com/item/1005008777248600.html) | R$ 25,29 | 328+ |
| Strap com munhequeira acolchoada (par) | [1005012986686393](https://pt.aliexpress.com/item/1005012986686393.html) | R$ 18,52 | 10.000+ |
| Legging empina-bumbum sem costura | [1005006784732012](https://pt.aliexpress.com/item/1005006784732012.html) | R$ 37,99 | 10.000+ |
| Conjunto sem costura top + legging | [1005011865611577](https://pt.aliexpress.com/item/1005011865611577.html) | R$ 85,19 | 5.000+ |
| Macaquinho fitness | [1005006266282044](https://pt.aliexpress.com/item/1005006266282044.html) | R$ 47,89 | 2.000+ |
| Short empina-bumbum sem costura | [1005009677311882](https://pt.aliexpress.com/item/1005009677311882.html) | R$ 36,63 | 2.000+ |
| Short-saia de treino (saia com short) | [1005004858887734](https://pt.aliexpress.com/item/1005004858887734.html) | R$ 36,29 | 240+ |
| Top com bojo removível | [1005010206859429](https://pt.aliexpress.com/item/1005010206859429.html) | R$ 30,97 | 10.000+ |
| Bermuda 2 em 1 masculina (com compressão por dentro) | [1005008659198677](https://pt.aliexpress.com/item/1005008659198677.html) | R$ 42,88 | 2.000+ |
| Calça jogger masculina de treino | [1005006860855929](https://pt.aliexpress.com/item/1005006860855929.html) | R$ 38,49 | 10.000+ |
| Camisa de compressão manga longa masculina | [1005006995616976](https://pt.aliexpress.com/item/1005006995616976.html) | R$ 38,81 | 10.000+ |
| Regata cavada masculina | [1005008740559681](https://pt.aliexpress.com/item/1005008740559681.html) | R$ 24,59 | 5.000+ |
| Camiseta oversized masculina (algodão pesado) | [1005009059479391](https://pt.aliexpress.com/item/1005009059479391.html) | R$ 53,42 | 4.000+ |
| Meias de cano alto (kit 5 pares) | [1005007011606802](https://pt.aliexpress.com/item/1005007011606802.html) | R$ 26,13 | 1.000+ |
| Luva de academia | [1005006713488514](https://pt.aliexpress.com/item/1005006713488514.html) | R$ 17,34 | 4.000+ |
| Toalha de microfibra | [1005007446808515](https://pt.aliexpress.com/item/1005007446808515.html) | R$ 13,81 | 5.000+ |
| Faixa de cabelo esportiva | [1005011743045406](https://pt.aliexpress.com/item/1005011743045406.html) | R$ 11,89 | 10.000+ |
| Coqueteleira com compartimentos | [1005005114965827](https://pt.aliexpress.com/item/1005005114965827.html) | R$ 20,03 | 5.000+ |

## Fontes

- Buscas na Amazon Brasil em 23/10/2026, no formato `amazon.com.br/s?k=<termo>`, com os termos da coluna "Produto"
  (por exemplo [joelheira compressão 7mm](https://www.amazon.com.br/s?k=joelheira+compress%C3%A3o+7mm),
  [cinto glúteo](https://www.amazon.com.br/s?k=cinto+gl%C3%BAteo) e
  [legging empina bumbum](https://www.amazon.com.br/s?k=legging+empina+bumbum)).
- Buscas no AliExpress Brasil ordenadas por pedidos, no formato
  `pt.aliexpress.com/w/wholesale-<termo>.html?SortType=total_tranpro_desc` (por exemplo
  [knee sleeves 7mm](https://pt.aliexpress.com/w/wholesale-knee-sleeves-7mm.html?SortType=total_tranpro_desc) e
  [hip thrust belt](https://pt.aliexpress.com/w/wholesale-hip-thrust-belt.html?SortType=total_tranpro_desc)).
- Mais vendidos de esporte com envio do Brasil no AliExpress:
  [FindNiche](https://findniche.com/aliexpress/best-selling-sports-and-entertainment-products-br) (a joelheira de
  compressão está entre os 10 mais vendidos, com quase 99 mil pedidos).
- Impostos: imposto de importação zerado para compras de até US$ 50 no Remessa Conforme desde 12/05/2026
  ([Econet](https://blog.econeteditora.com.br/remessa-conforme-o-que-muda-com-a-portaria-mf-1-342-2026/)) e ICMS de
  17% a 20% conforme o estado ([DHL](https://www.dhl.com/discover/pt-br/assuntos-regulatorios/remessa-conforme)),
  cobrado antes da entrega ([Oficina da Net](https://www.oficinadanet.com.br/internet/48912-aliexpress-adere-ao-remessa-conforme-o-que-muda)).
  Confirme com a SIHI se ela recolhe os impostos no envio ou se o cliente paga na entrega: isso muda o preço final.
