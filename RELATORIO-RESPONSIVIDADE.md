# Relatório de responsividade

## Objetivo
Validar a adaptação do site para smartphones, tablets, notebooks e desktops, considerando diferentes tamanhos de tela e engines de navegador (Chromium, Firefox e WebKit).

## Cenários validados
- Smartphone retrato: `390x844`
- Smartphone paisagem: `844x390`
- Tablet retrato: `768x1024`
- Tablet paisagem: `1024x768`
- Notebook: `1366x768`
- Desktop Full HD: `1920x1080`

## Resultado geral
- ✅ Layout responsivo sem overflow horizontal em todos os cenários após ajuste de CSS.
- ✅ Componentes interativos permaneceram funcionais (`13` controles interativos detectados em todos os cenários).
- ✅ Renderização consistente nas engines Chromium, Firefox e WebKit.
- ⚠️ Há aviso não-bloqueante no console em Chromium/WebKit sobre a diretiva `frame-ancestors` quando declarada via `meta` CSP.

## Correção aplicada
Foi identificado overflow horizontal em smartphone retrato causado pelo bloco de título no header (nome + avatar). O CSS foi ajustado para permitir quebra do título e melhor adaptação em telas menores.
