(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const currency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  const state = {
    unit: ACADEMIA.unidades[0].id,
    period: "mensal",
    gallery: "todas",
    team: "todas",
    lightbox: -1,
  };
  const selectedUnit = () =>
    ACADEMIA.unidades.find((unit) => unit.id === state.unit);
  const unitName = (id) =>
    ACADEMIA.unidades.find((unit) => unit.id === id)?.nome || "";
  const dialog = $("#site-dialog");
  const dialogContent = $("#dialog-content");
  let returnFocus = null;
  let imageTransition = null;
  let revealObserver;

  // SVGs próprios: sem dependência de biblioteca ou CDN.
  const paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    "arrow-diagonal": '<path d="M5 19 19 5M5 5h14v14"/>',
    "arrow-down": '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    "arrow-up": '<path d="M12 20V4m-6 6 6-6 6 6"/>',
    "arrow-left": '<path d="M20 12H4m6-6-6 6 6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    dumbbell:
      '<path d="m7 7 10 10M4 6l2-2 3 3-2 2zm13 9 2-2 3 3-2 2zM2 9l7-7M15 22l7-7M6 13l7-7M11 18l7-7"/>',
    shield:
      '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-5"/>',
    users:
      '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/>',
    heart:
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    stretch:
      '<circle cx="12" cy="4" r="2"/><path d="m4 10 8-2 8 2M12 8v7m0 0-6 6m6-6 6 6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone:
      '<path d="m5 3 4 1 1 5-3 2c2 4 3 5 7 7l2-3 5 1 1 4c-3 5-9 1-14-4S-1 6 5 3z"/>',
    chat: '<path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.6A9 9 0 1 1 21 11.5z"/><path d="M8 11h8M8 15h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.activity}</svg>`;
  function renderIcons(root = document) {
    $$("[data-icon]", root).forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
  }
  function announce(message) {
    $("#site-status").textContent = message;
  }
  function pressGroup(selector, attribute, value) {
    $$(selector).forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset[attribute] === value),
      ),
    );
  }
  function observeReveals() {
    if (revealObserver)
      $$(".reveal:not(.is-visible)").forEach((el) =>
        revealObserver.observe(el),
      );
  }
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function renderPlans() {
    const unit = selectedUnit();
    const period = ACADEMIA.periodos[state.period];
    $("#plans-grid").innerHTML = ACADEMIA.planos
      .map((plan) => {
        const price = unit.precos[state.period][plan.id];
        const [whole, cents] = price.toFixed(2).split(".");
        const total = currency((Math.round(price * 100) * period.meses) / 100);
        return `<article class="plan-card ${plan.destaque ? "featured" : ""}">
        ${plan.destaque ? '<span class="plan-badge">Mais escolhido · Exemplo</span>' : ""}
        <div class="plan-top"><h3>${escape(plan.nome)}</h3>${icon(plan.icon)}</div>
        <p class="plan-tagline">${escape(plan.frase)}</p>
        <div class="plan-price is-updating"><span class="currency">R$</span><strong>${whole}<span class="cents">,${cents}</span></strong><span class="per">/mês</span></div>
        <p class="plan-period">${escape(period.descricao)}<br>${period.meses > 1 ? `Total ilustrativo: ${total}` : "Valor ilustrativo mensal"}</p>
        <ul class="plan-features">${plan.beneficios.map((benefit) => `<li>${icon("check")}${escape(benefit)}</li>`).join("")}</ul>
        <button class="button ${plan.destaque ? "button-primary" : "button-dark"}" data-plan="${escape(plan.id)}">${escape(period.botao)} ${icon("arrow")}</button>
      </article>`;
      })
      .join("");
    $$("[data-unit-name]").forEach((el) => {
      el.textContent = unit.nome;
    });
    pressGroup("[data-period]", "period", state.period);
  }

  function renderModalities() {
    $("#modalities-grid").innerHTML = ACADEMIA.modalidades
      .map(
        (modality) => `<article class="modality-card reveal">
      <img src="${escape(modality.imagem)}" alt="${escape(modality.nome)} — fotografia ilustrativa." width="900" height="900" loading="lazy">
      <div class="modality-content"><span class="modality-category">${escape(modality.categoria)}</span><h3>${escape(modality.nome)} ${icon(modality.icon)}</h3><p>${escape(modality.descricao)}</p><button data-modality="${escape(modality.id)}" aria-label="Saiba mais sobre ${escape(modality.nome)}">Saiba mais ${icon("arrow-diagonal")}</button></div>
    </article>`,
      )
      .join("");
  }

  const galleryItems = () =>
    ACADEMIA.galeria.filter(
      (item) => state.gallery === "todas" || item.unidade === state.gallery,
    );
  function renderGallery() {
    const items = galleryItems();
    $("#gallery-grid").innerHTML = items.length
      ? items
          .map(
            (item, index) =>
              `<button class="gallery-item filter-enter" data-lightbox="${index}" aria-label="Ampliar ${escape(item.nome)} — ${escape(unitName(item.unidade))}"><img src="${escape(item.imagem)}" alt="${escape(item.alt)}" loading="lazy" width="1000" height="700"><span class="gallery-caption"><span><small>Unidade ${escape(unitName(item.unidade))} · Exemplo</small><strong>${escape(item.nome)}</strong></span><span>${icon("expand")}</span></span></button>`,
          )
          .join("")
      : '<p class="empty-state">Não há fotos para esta unidade. Escolha Todas para explorar a galeria.</p>';
    pressGroup("[data-gallery]", "gallery", state.gallery);
  }

  function renderTeam() {
    const team = ACADEMIA.professores.filter(
      (person) => state.team === "todas" || person.unidade === state.team,
    );
    $("#team-grid").innerHTML = team.length
      ? team
          .map(
            (person) =>
              `<article class="team-card filter-enter"><div class="team-photo"><img src="${escape(person.imagem)}" alt="Fotografia ilustrativa de treino para o perfil fictício de ${escape(person.nome)}." width="700" height="850" loading="lazy"><span>Unidade ${escape(unitName(person.unidade))}</span></div><div class="team-content"><h3>${escape(person.nome)}</h3><p class="team-specialty">${escape(person.especialidade)}</p><p>${escape(person.descricao)}</p><small>Perfil fictício · Fotografia ilustrativa</small></div></article>`,
          )
          .join("")
      : '<p class="empty-state">Não há perfis demonstrativos nesta unidade. Escolha Todos para conhecer a equipe.</p>';
    pressGroup("[data-team]", "team", state.team);
  }

  function renderUnit() {
    const unit = selectedUnit();
    $("#hero-unit-name").textContent = `Unidade ${unit.nome}`;
    $("#hero-unit-description").textContent = unit.chamada;
    $("#hero-address").textContent =
      unit.endereco || "Localização disponível na versão oficial";
    $("#unit-title").textContent = `Unidade ${unit.nome}`;
    $("#unit-description").textContent = unit.descricao;
    $("#unit-address").textContent =
      unit.endereco || "Endereço a confirmar na versão oficial";
    $("#unit-hours").textContent =
      unit.horarios || "Horários a confirmar na versão oficial";
    $("#unit-phone").textContent =
      unit.telefone || "Contato disponível na versão oficial";
    const photo = $("#unit-image");
    photo.src = unit.imagem;
    photo.alt = `Academia ilustrativa para a unidade demonstrativa ${unit.nome}.`;
    photo.classList.remove("is-updating");
    void photo.offsetWidth;
    photo.classList.add("is-updating");
    $("#unit-modalities").innerHTML = unit.modalidades
      .map((name) => `<span>${escape(name)} · Exemplo</span>`)
      .join("");
    pressGroup("[data-unit]", "unit", unit.id);
    $$("[data-unit]").forEach((button) => {
      const name = unitName(button.dataset.unit);
      button.setAttribute("aria-label", `Selecionar unidade ${name}`);
      const index =
        ACADEMIA.unidades.findIndex((item) => item.id === button.dataset.unit) +
        1;
      if (button.closest(".unit-panel-tabs"))
        button.textContent = `${String(index).padStart(2, "0")} — ${name}`;
      else
        button.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
            node.textContent = ` ${name} `;
        });
    });
    $$("[data-select-unit]").forEach((link) => {
      link.textContent = `Unidade ${unitName(link.dataset.selectUnit)}`;
    });
    renderMap();
  }

  function mapUrl(unit) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.endereco)}`;
  }
  function renderMap() {
    const unit = selectedUnit();
    const container = $("#map-container");
    let embed = "";
    if (unit.endereco && unit.mapsEmbedUrl) {
      const url = safeUrl(unit.mapsEmbedUrl);
      if (url) {
        const parsed = new URL(url);
        if (
          ["www.google.com", "maps.google.com", "www.google.com.br"].includes(
            parsed.hostname,
          ) &&
          parsed.pathname.startsWith("/maps/embed")
        )
          embed = url;
      }
    }
    if (!unit.endereco) {
      container.innerHTML = `<div class="map-placeholder"><span>${icon("pin")}</span><div><h4>Seu ponto de partida, em breve.</h4><p>O endereço da unidade ${escape(unit.nome)} será exibido na versão oficial. Este espaço está preparado para o mapa da academia.</p></div></div>`;
    } else if (embed) {
      container.innerHTML = `<iframe title="Localização da unidade ${escape(unit.nome)}" src="${escape(embed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    } else {
      container.innerHTML = `<div class="map-link"><div><h4>Unidade ${escape(unit.nome)}</h4><p>${escape(unit.endereco)}</p></div><a class="button button-outline" href="${escape(mapUrl(unit))}" target="_blank" rel="noopener noreferrer">Abrir no Google Maps ${icon("arrow-diagonal")}</a></div>`;
    }
  }

  function transitionHero(unit) {
    const current = $("#hero-image");
    const next = $("#hero-image-next");
    clearTimeout(imageTransition);
    next.onload = null;
    next.classList.remove("is-entering");
    const requested = unit.id;
    next.src = unit.imagemHero;
    const enter = () => {
      if (state.unit !== requested) return;
      next.classList.add("is-entering");
      imageTransition = setTimeout(
        () => {
          if (state.unit !== requested) return;
          current.src = unit.imagemHero;
          next.classList.remove("is-entering");
        },
        matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700,
      );
    };
    if (next.complete && next.naturalWidth) enter();
    else next.onload = enter;
  }
  function selectUnit(id) {
    if (!ACADEMIA.unidades.some((unit) => unit.id === id) || id === state.unit)
      return;
    state.unit = id;
    transitionHero(selectedUnit());
    renderUnit();
    renderPlans();
    announce(
      `Unidade ${selectedUnit().nome} selecionada. Planos e localização atualizados.`,
    );
  }

  function openDialog(title, description, extra = "", options = {}) {
    state.lightbox = -1;
    if (!dialog.open) returnFocus = document.activeElement;
    dialog.classList.toggle("lightbox-dialog", Boolean(options.lightbox));
    dialogContent.innerHTML = `<p class="dialog-eyebrow">${escape(options.eyebrow || `${ACADEMIA.nome} · Demonstração`)}</p><h2 class="dialog-title" id="dialog-title">${escape(title)}</h2><p class="dialog-description" id="dialog-description">${escape(description)}</p>${extra}<div class="dialog-actions"><button class="button button-outline" data-close-dialog>Continuar explorando ${icon("arrow")}</button></div>`;
    document.body.classList.add("dialog-open");
    if (!dialog.open) dialog.showModal();
    $(".dialog-close").focus({ preventScroll: true });
  }
  function closeDialog() {
    dialog.close();
  }
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    state.lightbox = -1;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        closeDialog();
    }
  });
  $(".dialog-close").addEventListener("click", closeDialog);

  function showPlan(id) {
    const plan = ACADEMIA.planos.find((item) => item.id === id);
    if (!plan) return;
    const unit = selectedUnit();
    const period = ACADEMIA.periodos[state.period];
    const price = unit.precos[state.period][id];
    const extra = `<div class="dialog-detail"><strong>Unidade ${escape(unit.nome)} · ${escape(period.nome)}</strong><br>${currency(price)}/mês · ${escape(period.descricao)}<br>Total ilustrativo: ${currency((Math.round(price * 100) * period.meses) / 100)}</div>${unit.telefone || ACADEMIA.contatos.whatsapp ? `<div class="dialog-actions"><button class="button button-primary" data-plan-contact="${escape(id)}">Consultar a unidade ${icon("arrow")}</button></div>` : ""}`;
    openDialog(
      `Plano ${plan.nome}`,
      "Este é um exemplo de plano. Valores e benefícios são ilustrativos. Nenhuma matrícula, reserva ou cobrança será realizada. Consulte as condições na versão oficial.",
      extra,
    );
  }

  function abrirWhatsApp(numero, mensagem) {
    const clean = String(numero || "").replace(/\D/g, "");
    if (clean.length < 10 || clean.length > 15) {
      openDialog(
        "Vamos conversar?",
        "Contato disponível na versão oficial. O telefone desta unidade ainda não foi configurado.",
        `<div class="dialog-detail">Unidade selecionada: <strong>${escape(selectedUnit().nome)}</strong><br>Explore os planos e a estrutura enquanto isso.</div>`,
      );
      return;
    }
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  // Funções reutilizáveis para integração na versão oficial.
  window.abrirWhatsApp = abrirWhatsApp;
  window.mostrarModalDemo = (mensagem) =>
    openDialog("Experiência demonstrativa", mensagem);
  function contact(planId) {
    const unit = selectedUnit();
    const plan = ACADEMIA.planos.find((item) => item.id === planId);
    const message = plan
      ? `Olá, gostaria de conhecer o plano ${plan.nome} (${ACADEMIA.periodos[state.period].nome}) da unidade ${unit.nome}.`
      : `Olá, gostaria de saber mais sobre os planos e matrículas da unidade ${unit.nome}.`;
    abrirWhatsApp(unit.telefone || ACADEMIA.contatos.whatsapp, message);
  }

  function showLightbox(index, keepFocus = false) {
    const items = galleryItems();
    if (!items.length) return;
    index = (index + items.length) % items.length;
    const item = items[index];
    if (!keepFocus) returnFocus = document.activeElement;
    const activeAction = keepFocus
      ? document.activeElement?.dataset.lightboxStep
      : null;
    state.lightbox = index;
    dialog.classList.add("lightbox-dialog");
    dialogContent.innerHTML = `<img class="lightbox-photo" src="${escape(item.imagem)}" alt="${escape(item.alt)}" width="1000" height="700"><div class="lightbox-bottom"><div><h2 class="dialog-title" id="dialog-title">${escape(item.nome)}</h2><p class="dialog-description" id="dialog-description">Unidade ${escape(unitName(item.unidade))} · Fotografia ilustrativa, sem vínculo com academia real.</p></div><div class="lightbox-controls"><span class="lightbox-count" aria-live="polite">${index + 1} / ${items.length}</span><button data-lightbox-step="-1" aria-label="Fotografia anterior">${icon("arrow-left")}</button><button data-lightbox-step="1" aria-label="Próxima fotografia">${icon("arrow")}</button></div></div>`;
    document.body.classList.add("dialog-open");
    if (!dialog.open) dialog.showModal();
    if (activeAction)
      $(`[data-lightbox-step="${activeAction}"]`).focus({
        preventScroll: true,
      });
    else if (!keepFocus) $(".dialog-close").focus({ preventScroll: true });
    announce(`${item.nome}. Fotografia ${index + 1} de ${items.length}.`);
  }

  function renderPartners() {
    $("#convenios").hidden = !ACADEMIA.convenios.ativo;
    if (!ACADEMIA.convenios.ativo) {
      $$('a[href="#convenios"]').forEach((link) => {
        link.hidden = true;
      });
      return;
    }
    $("#partners-grid").innerHTML = ACADEMIA.convenios.plataformas
      .map(
        (name) =>
          `<div class="partner-card"><h3>${escape(name)}</h3><small>Espaço demonstrativo</small><button class="text-button" data-partner="${escape(name)}">Ver como funciona ${icon("arrow-diagonal")}</button></div>`,
      )
      .join("");
  }
  function renderTestimonials() {
    $("#testimonials-grid").innerHTML = ACADEMIA.depoimentos
      .map(
        (person) =>
          `<article class="testimonial-card reveal"><div class="stars" aria-label="Estrelas ilustrativas, sem avaliação real">★★★★★</div><blockquote>“${escape(person.texto)}”</blockquote><div class="testimonial-person"><span class="initials" aria-hidden="true">${escape(person.nome.charAt(0))}</span><div><strong>${escape(person.nome)}</strong><small>Exemplo fictício de layout</small></div></div></article>`,
      )
      .join("");
  }
  function renderFaq() {
    $("#faq-list").innerHTML = ACADEMIA.faq
      .map(
        (item, index) =>
          `<div class="faq-item"><h3><button class="faq-question" id="faq-question-${index}" aria-expanded="false" aria-controls="faq-answer-${index}">${escape(item.pergunta)} ${icon("plus")}</button></h3><div class="faq-answer" id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}" hidden>${escape(item.resposta)}</div></div>`,
      )
      .join("");
  }
  function toggleFaq(button) {
    const expand = button.getAttribute("aria-expanded") !== "true";
    $$(".faq-question").forEach((item) => {
      const isOpen = item === button && expand;
      item.setAttribute("aria-expanded", String(isOpen));
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !isOpen;
    });
  }

  const menuButton = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  function setMenu(open, restore = false) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    $("#header").classList.toggle("menu-visible", open);
    if (restore) menuButton.focus();
  }
  menuButton.addEventListener("click", () => setMenu(mobileNav.hidden));
  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  mobileNav.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const links = $$("a", mobileNav);
    if (event.shiftKey && document.activeElement === links[0]) {
      event.preventDefault();
      menuButton.focus();
    } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      menuButton.focus();
    }
  });
  menuButton.addEventListener("keydown", (event) => {
    if (mobileNav.hidden || event.key !== "Tab") return;
    event.preventDefault();
    (event.shiftKey ? $$("a", mobileNav).at(-1) : $("a", mobileNav)).focus();
  });
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button,a");
    if (!button || button.disabled) return;
    const data = button.dataset;
    if (data.unit) selectUnit(data.unit);
    if (data.selectUnit) selectUnit(data.selectUnit);
    if (data.period && ACADEMIA.periodos[data.period]) {
      state.period = data.period;
      renderPlans();
      announce(
        `Período ${ACADEMIA.periodos[state.period].nome} selecionado. Preços atualizados.`,
      );
    }
    if (data.plan) showPlan(data.plan);
    if ("contact" in data) contact();
    if (data.planContact) contact(data.planContact);
    if (data.modality) {
      const modality = ACADEMIA.modalidades.find(
        (item) => item.id === data.modality,
      );
      if (modality)
        openDialog(
          modality.nome,
          modality.detalhe,
          `<img class="dialog-photo" src="${escape(modality.imagem)}" alt="Fotografia ilustrativa de ${escape(modality.nome)}." width="900" height="600">`,
          { eyebrow: "Modalidade demonstrativa" },
        );
    }
    if (data.gallery) {
      state.gallery = data.gallery;
      renderGallery();
      announce(`${galleryItems().length} fotografias exibidas.`);
    }
    if (data.team) {
      state.team = data.team;
      renderTeam();
      announce(`${$("#team-grid").children.length} perfis exibidos.`);
    }
    if ("lightbox" in data) showLightbox(Number(data.lightbox));
    if (data.lightboxStep)
      showLightbox(state.lightbox + Number(data.lightboxStep), true);
    if (data.partner)
      openDialog(
        `Treine com ${data.partner}`,
        `Este espaço exemplifica a apresentação de ${data.partner}. Não há parceria oficial confirmada. Na versão oficial, verifique sua elegibilidade, as condições do seu plano e a disponibilidade na unidade ${selectedUnit().nome}.`,
      );
    if ("closeDialog" in data) closeDialog();
    if (button.classList.contains("faq-question")) toggleFaq(button);
    if (button.id === "directions-button") {
      const unit = selectedUnit();
      if (unit.endereco)
        window.open(mapUrl(unit), "_blank", "noopener,noreferrer");
      else
        openDialog(
          "Seu próximo endereço",
          `O endereço da unidade ${unit.nome} ainda não foi configurado. A localização e o caminho no Google Maps estarão disponíveis na versão oficial.`,
        );
    }
    if (button.classList.contains("back-top"))
      window.scrollTo({
        top: 0,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) setMenu(false, true);
    if (
      dialog.open &&
      state.lightbox >= 0 &&
      ["ArrowRight", "ArrowLeft"].includes(event.key)
    ) {
      event.preventDefault();
      showLightbox(
        state.lightbox + (event.key === "ArrowRight" ? 1 : -1),
        true,
      );
    }
  });

  function initializeBrand() {
    $("[data-contact-brand]").textContent = `Fale com ${ACADEMIA.nome}`;
    const name = ACADEMIA.nome.trim().split(/\s+/);
    $$("[data-brand]").forEach((el) => {
      el.textContent = name.length > 1 ? name.slice(0, -1).join(" ") : name[0];
      el.nextElementSibling.textContent = name.length > 1 ? name.at(-1) : "";
    });
    $$("[data-full-brand]").forEach((el) => {
      el.textContent = ACADEMIA.nome;
    });
    $$(".brand").forEach((el) =>
      el.setAttribute("aria-label", `${ACADEMIA.nome} — início`),
    );
    $$("[data-brand-description]").forEach((el) => {
      el.textContent = ACADEMIA.descricao;
    });
    document.title = `${ACADEMIA.nome} — Sua evolução começa aqui`;
    document.documentElement.style.setProperty(
      "--color-primary",
      ACADEMIA.cores.primaria,
    );
    document.documentElement.style.setProperty(
      "--color-bg",
      ACADEMIA.cores.fundo,
    );
    $("#year").textContent = new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    }).format(new Date());
    $("#structure-extras").textContent = ACADEMIA.estruturaExtras.join(" · ");
    $("#social-links").innerHTML = ["instagram", "facebook"]
      .filter((key) => safeUrl(ACADEMIA.contatos[key]))
      .map(
        (key) =>
          `<a href="${escape(safeUrl(ACADEMIA.contatos[key]))}" target="_blank" rel="noopener noreferrer">${key === "instagram" ? "Instagram" : "Facebook"} ${icon("arrow-diagonal")}</a>`,
      )
      .join("");
    $("#hero-image").src = selectedUnit().imagemHero;
  }
  function initializeMotion() {
    if (!("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.body.classList.add("motion-ready");
    observeReveals();
    const navLinks = $$(".desktop-nav a");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    navLinks.forEach((link) => {
      const section = $(link.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });
  }
  let scrollPending = false;
  function updateScroll() {
    $("#header").classList.toggle("scrolled", scrollY > 30);
    $(".back-top").hidden = scrollY < 600;
    scrollPending = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scrollPending) {
        scrollPending = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );

  initializeBrand();
  renderIcons();
  renderPlans();
  renderModalities();
  renderGallery();
  renderTeam();
  renderUnit();
  renderPartners();
  renderTestimonials();
  renderFaq();
  initializeMotion();
  updateScroll();
})();
