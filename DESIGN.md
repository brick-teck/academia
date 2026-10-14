---
version: alpha
colors:
  primary: "#E63946"
  primaryHover: "#FF4D58"
  background: "#080808"
  surface: "#171717"
  text: "#F7F7F7"
  muted: "#A1A1A1"
typography:
  display:
    fontFamily: "Bebas Neue, Impact, sans-serif"
  heading:
    fontFamily: "Oswald, Arial Narrow, sans-serif"
  body:
    fontFamily: "Inter, Arial, sans-serif"
rounded:
  control: "4px"
  modal: "12px"
spacing:
  section: "104px"
  gap: "24px"
components:
  button:
    height: "48px"
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
  buttonHover:
    backgroundColor: "{colors.primaryHover}"
  body:
    textColor: "{colors.text}"
  caption:
    textColor: "{colors.muted}"
  container:
    width: "1320px"
---

# PULSE FITNESS

## Overview

Site de marca, pt-BR, para demonstração comercial de academias com múltiplas unidades. Referência: campanha de força e treinamento, com tratamento fotográfico de alto contraste e composição ampla. Assinatura: EVOLUÇÃO em vermelho monumental, atravessando a composição fotográfica, com duas abas de unidade ancoradas à base. Evitar neon, visual gamer, cartões arredondados em excesso, estatísticas fictícias e identidade de barbearia.

## Colors

Valores canônicos em css/style.css :root: primary → --color-primary; primaryHover → --color-hover; background → --color-bg; surface → --color-surface; text → --color-text; muted → --color-muted. data.js permite substituir primária e fundo, aplicados uma única vez por main.js. Superfície clara usa o branco do sistema e texto escuro. Vermelho é expressão de marca; ações vermelhas usam texto quase preto para contraste.

## Typography

Google Fonts, arquivos locais: Bebas Neue para manchetes, Oswald para rótulos e Inter para leitura. H1 fluido, 72–144 px no desktop, 64 px ou menor nos celulares estreitos. Sem letra miúda para condições comerciais. Textos corridos em frase normal, títulos e controles curtos em caixa alta.

## Layout

Grid máximo 1320 px, margens fluidas. Hero de aproximadamente uma tela, planos primeiro. Modalidades em mosaico; galeria em grid; equipe em 3/2/1 colunas. Ritmo com superfícies claras em planos, equipe e FAQ. Breakpoints em 1100, 900, 600 e 380 px; reflow sem recortar conteúdo. Fotos com dimensões reservadas.

## Elevation & Depth

Sombras somente no header sobre foto e overlays. Cards com bordas finas e diferenças de superfície. Overlays escurecem fotografias para legibilidade. Dialog no top layer nativo, fundo inerte e rolagem bloqueada de forma estável.

## Shapes

Retângulos e pequenos raios. Marca própria em SVG com sinal de pulso angular. Linhas inclinadas apenas no acento de marca, sem perder foco nem área de toque.

## Components

Botões sólidos, outline e texto compartilham foco, altura mínima e cursor. Grupos selecionáveis são botões com aria-pressed. FAQ com aria-expanded/aria-controls. Dialog compartilhado restaura foco; lightbox usa o mesmo ciclo com setas e Escape. Menu mobile tem fechamento por seleção, Escape e mudança de viewport. Scrollbar global usa tokens e forced-colors.

## Do's and Don'ts

Fotografias e profissionais explicitamente ilustrativos. Não atribuir fotos a unidades reais. Não usar endereços, telefones ou convênios inventados. Informar total e duração dos períodos de plano. Conteúdo revelado continua disponível com JavaScript desligado; no reduced-motion, sem animações, zoom ou scroll suave.
