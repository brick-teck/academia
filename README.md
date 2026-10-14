# PULSE FITNESS

Website demonstrativo premium para uma rede fictícia de academias. HTML5, CSS3 e JavaScript puro; sem framework, build, backend ou banco de dados.

## Abrir

Abra `index.html` diretamente no navegador. As imagens, fontes Google Fonts e ícones estão no projeto e funcionam sem internet. Google Maps, redes sociais e WhatsApp, quando configurados, exigem internet.

## Arquivos

```text
academia-demo/
├── index.html
├── css/
│   ├── style.css         # Tokens, identidade e componentes
│   ├── responsive.css    # Reflow de desktop até 320 px
│   └── animations.css    # Transições e reduced-motion
├── js/
│   ├── data.js           # Toda a configuração comercial
│   └── main.js           # Renderização e interações compartilhadas
├── assets/
│   ├── images/          # Fotografias WebP locais
│   ├── fonts/           # Google Fonts locais e licenças OFL
│   ├── icons/           # Favicon
│   ├── logo/            # Marca fictícia em SVG
│   └── CREDITS.md
├── DESIGN.md            # Direção visual e mapeamento dos tokens
├── docs/                # Plano e registro de verificação
└── tests/               # Verificação opcional; dispensável para publicar
```

## Personalizar

Edite o objeto `ACADEMIA` em `js/data.js`:

| Campo                           | Uso                                                                |
| ------------------------------- | ------------------------------------------------------------------ |
| `nome`, `descricao`             | Marca e descrição do rodapé                                        |
| `cores.primaria`, `cores.fundo` | Tokens de marca aplicados globalmente                              |
| `unidades`                      | Glória/Laguna, textos, fotos, contato, endereço, horários e preços |
| `periodos`                      | Nomes, duração em meses e texto dos botões                         |
| `planos`                        | Benefícios, nomes e destaque de cada plano                         |
| `modalidades`                   | Fotografias, textos e detalhes exibidos no modal                   |
| `galeria`, `professores`        | Conteúdo associado ao ID de cada unidade                           |
| `convenios.ativo`               | `false` oculta a seção e seu link no rodapé                        |
| `depoimentos`, `faq`            | Conteúdo das histórias e perguntas                                 |
| `contatos`                      | WhatsApp geral, Instagram e Facebook                               |

Preserve os IDs `gloria` e `laguna` ao renomear as duas unidades. Para acrescentar unidades, acrescente também seus controles ao HTML. Os nomes exibidos nos controles existentes são atualizados automaticamente.

Os preços são **equivalentes mensais ilustrativos**. Nos períodos trimestral e anual, o site informa a duração e o total correspondente; não cria descontos oficiais nem processa contratação. Configure `unidades[n].precos[periodo][plano]`. Uma mudança de unidade preserva o período selecionado e atualiza os preços.

A seleção da unidade sincroniza Hero, planos, painel de localização e contatos. Os filtros da galeria e da equipe são independentes para permitir comparar as unidades.

### Contatos

Preencha `unidades[n].telefone` com o número completo, incluindo DDI e DDD. O WhatsApp da unidade tem prioridade; se estiver vazio, usa `contatos.whatsapp`. Sem número válido, abre um modal demonstrativo. Nenhuma mensagem é enviada automaticamente. `abrirWhatsApp(numero, mensagem)` e `mostrarModalDemo(mensagem)` estão disponíveis globalmente para integração.

As redes sociais aceitam URLs HTTPS. Quando vazias, seus links são omitidos. Não há formulário nem armazenamento de dados pessoais.

### Google Maps

Defina um endereço **confirmado** em `unidades[n].endereco`. O botão Como chegar então abre a pesquisa oficial do Google Maps com esse endereço.

Para um mapa embutido, copie a URL `src` fornecida pelo Google Maps em **Compartilhar → Incorporar um mapa** e coloque em `mapsEmbedUrl`. São aceitas URLs HTTPS de `www.google.com`, `maps.google.com` ou `www.google.com.br`, com caminho `/maps/embed`. O endereço também precisa estar preenchido. Sem endereço, exibe um estado demonstrativo e não inventa coordenadas.

### Convênios

A seção Wellhub/TotalPass apresenta apenas exemplos em texto. Não usa logos oficiais nem afirma parceria. `convenios.ativo = false` desativa a seção. A configuração `parceriaConfirmada` registra a situação comercial; mudar esse campo não remove automaticamente os avisos demonstrativos. Antes de uma versão real, revise a redação conforme a parceria efetivamente confirmada.

### Identidade e fotografias

Os tokens de layout, tipografia, foco e animações estão em `css/style.css`. A direção visual está documentada em `DESIGN.md`. Ao trocar cores, confirme o contraste dos botões, textos e estados de foco.

Substitua as fotos em `assets/images/` e atualize os caminhos em `data.js`. Fotos fixas de experiência e CTA têm seus caminhos em `index.html`. Use WebP e mantenha imagens do Hero em até 1920 px. As imagens atuais são ilustrativas, não representam unidades reais nem os profissionais fictícios.

Fontes: Bebas Neue, Oswald e Inter, distribuídas pelo Google Fonts sob SIL Open Font License, incluída em `assets/fonts/`. Fontes e fotografias estão creditadas em `assets/CREDITS.md`. Fotografias obtidas do Unsplash conforme sua [licença](https://unsplash.com/license).

## Publicar no GitHub Pages

1. Envie o conteúdo de `academia-demo` para a raiz de um repositório, ou mantenha a pasta dentro dele.
2. Ative o Pages nas configurações do repositório, escolhendo a branch e a raiz publicada.
3. Na raiz, a URL abre direto; mantendo a pasta, acesse `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/academia-demo/`.
4. Preserve a estrutura: todos os arquivos locais usam caminhos relativos. Nenhum build é necessário.
5. Para compartilhamento social, troque `og:image` pela URL HTTPS absoluta da foto no site publicado e acrescente `og:url` com a URL final. Personalize título e descrição do HTML para SEO; crawlers podem não executar JavaScript.

Não publique `tests/`, `docs/` ou `premium-audit.json` se desejar enviar somente os arquivos do site. Isso não altera o funcionamento.

## Verificação opcional

O site não precisa de Node ou Python. Essas ferramentas servem apenas à manutenção e aos testes.

```powershell
node --check js/main.js
node --check js/data.js
node --test tests/data.test.cjs
```

Os testes de navegador usam Playwright e Edge. Instale as dependências **fora** do projeto:

```powershell
npm.cmd install --prefix "$env:TEMP/pulse-qa" playwright @axe-core/playwright
$env:PULSE_QA_MODULE = "$env:TEMP/pulse-qa/node_modules/playwright"
$env:PULSE_QA_AXE = "$env:TEMP/pulse-qa/node_modules/@axe-core/playwright"
node tests/browser.test.cjs
node tests/accessibility.test.cjs
```

Use `PULSE_QA_BROWSER` para indicar outro executável Chromium. O teste abre `index.html` por `file://`, percorre planos/unidades, filtros, modais, lightbox, menu, FAQ e verifica ausência de overflow nas larguras de 320 a 1920 px. Capturas e resultados ficam em `tests/evidence/`.

O script `tests/download-assets.py` permite baixar novamente os recursos originais; não participa do funcionamento do site. Os testes de configuração são voltados à versão demonstrativa padrão e devem ser adaptados quando contatos e endereços reais forem configurados.

## Limites da demonstração

Marca, preços, unidades, profissionais e depoimentos são fictícios. O site não realiza matrícula, reserva ou pagamento, não promete resultados físicos e não confirma parceria oficial com plataformas. Antes de apresentar uma versão comercial real, configure e confirme essas informações com a academia.
# academia
