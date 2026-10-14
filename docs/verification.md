# Verificação — 11/10/2026

## Escopo

Verificação em Microsoft Edge/Chromium no Windows, com arquivos locais (`file://`). Não foi publicada uma versão externa. Não foram testados aparelhos físicos nem Safari/Firefox.

## Evidências

- `node --check js/main.js` e `node --check js/data.js`: sintaxe válida.
- `node --test tests/data.test.cjs`: 3 testes de integridade/configuração.
- `tests/browser.test.cjs`: navegação real sem servidor; planos e totais por período; sincronização das unidades; filtros; modal; Escape e restauração de foco; lightbox por teclado; FAQ; menu mobile; movimento reduzido; imagens locais; console sem erros.
- Reflow verificado em 320, 375, 430, 768, 1024, 1440 e 1920 px, sem rolagem horizontal.
- `tests/accessibility.test.cjs`: Axe com regras WCAG A/AA, incluindo 2.1/2.2, nos estados desktop, mobile e modal. Não substitui avaliação manual com leitores de tela.
- Caminhos de Maps e WhatsApp testados com configuração apenas em memória e abertura externa interceptada. Os arquivos entregues preservam endereço e telefone vazios.
- Filtros sem conteúdo testados com dados removidos apenas em memória; exibem orientação para voltar a Todas/Todos.
- Capturas em `tests/evidence/`: Hero desktop/mobile, planos, modalidades, equipe, unidades, FAQ e página completa.
- `DESIGN.md`: linter oficial com 0 erros e 0 avisos.

## Auditor estático da skill premium

O resultado bruto do `audit_project.py --mode strict` está em `premium-audit.json`. O scanner sinaliza botões como sem ação porque, nesta versão, reconhece apenas atributos inline `onclick`, `@click` e `v-on:click`. Ele não analisa `addEventListener` nem delegação por `data-*`.

Todos os controles sinalizados têm handlers em `js/main.js`; suas ações foram verificadas em navegador pelos testes acima. Não foram adicionados handlers inline, desabilitados controles ou reduzida a área do scanner para esconder os falsos positivos. O resultado do scanner não é apresentado como aprovação limpa; os testes de execução são a evidência do comportamento.

## Limites intencionais

Revisão independente: nenhum problema crítico ou importante identificado. Verificados também cliques rápidos na troca de unidades, menu em 320 × 568 px, roteamento de WhatsApp configurado e preservação/restauração de foco do lightbox. Dois textos de marca foram ajustados para seguir `ACADEMIA.nome`.

- Contatos e localização exigem configuração confirmada; o estado padrão é demonstrativo.
- Contratação e envio automático de mensagens não fazem parte do site.
- Convênios, preços, pessoas e depoimentos são exemplos, explicitamente identificados.
- Open Graph deve receber URLs absolutas da publicação final, conforme README.
