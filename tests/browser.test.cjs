// QA optional: Playwright is installed outside the website. See README.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PULSE_QA_MODULE || "playwright");
const root = path.resolve(__dirname, "..");
const evidence = path.join(__dirname, "evidence");
fs.mkdirSync(evidence, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.PULSE_QA_BROWSER ||
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const check = (name, value) => {
    assert.ok(value, name);
    console.log("PASS " + name);
  };
  try {
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.evaluate(() => document.fonts.ready);
    check(
      "Renderiza 3 planos sem servidor",
      (await page.locator(".plan-card").count()) === 3,
    );
    check(
      "Renderiza modalidades, galeria, equipe e perguntas",
      (await page.locator(".modality-card").count()) === 6 &&
        (await page.locator(".gallery-item").count()) === 6 &&
        (await page.locator(".team-card").count()) === 3 &&
        (await page.locator(".faq-question").count()) === 7,
    );
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations().map((animation) => animation.finished),
      ),
    );
    await page.screenshot({ path: path.join(evidence, "desktop-hero.png") });
    await page.locator('[data-period="anual"]').click();
    check(
      "Anual informa total de 12 meses",
      (await page.locator(".plan-period").first().innerText()).includes(
        "958,80",
      ),
    );
    await page.locator('.unit-buttons [data-unit="laguna"]').click();
    check(
      "Unidade sincroniza Hero, plano e localização",
      (await page.locator("#hero-unit-name").textContent()).includes(
        "Laguna",
      ) &&
        (await page.locator("#unit-title").textContent()).includes("Laguna") &&
        (await page.locator(".selected-unit").textContent()).includes("Laguna"),
    );
    check(
      "Unidade muda preços",
      (await page.locator(".plan-price").first().innerText()).includes("82"),
    );
    await page.locator('[data-plan="start"]').click();
    check(
      "Modal confirma plano, unidade e período",
      (await page.locator("#dialog-content").innerText()).includes("Laguna") &&
        (await page.locator("#dialog-content").innerText()).includes("Anual"),
    );
    await page.keyboard.press("Escape");
    check(
      "Escape fecha modal e restaura foco",
      !(await page.locator("#site-dialog").evaluate((el) => el.open)) &&
        (await page
          .locator('[data-plan="start"]')
          .evaluate((el) => el === document.activeElement)),
    );
    await page.locator('[data-gallery="laguna"]').click();
    check(
      "Filtro de galeria",
      (await page.locator(".gallery-item").count()) === 3,
    );
    await page.locator(".gallery-item").first().click();
    check(
      "Lightbox abre com legenda",
      await page.locator("#site-dialog").evaluate((el) => el.open),
    );
    const caption = await page.locator("#dialog-title").innerText();
    await page.keyboard.press("ArrowRight");
    check(
      "Lightbox aceita navegação por teclado",
      (await page.locator("#dialog-title").innerText()) !== caption,
    );
    await page.keyboard.press("Tab");
    check(
      "Foco permanece no dialog",
      await page.evaluate(() =>
        document.querySelector("#site-dialog").contains(document.activeElement),
      ),
    );
    await page.keyboard.press("Escape");
    await page.locator('[data-team="laguna"]').click();
    check("Filtro de equipe", (await page.locator(".team-card").count()) === 1);
    await page.locator(".faq-question").first().click();
    check(
      "FAQ expõe resposta e estado acessível",
      (await page
        .locator(".faq-question")
        .first()
        .getAttribute("aria-expanded")) === "true" &&
        (await page.locator(".faq-answer").first().isVisible()),
    );
    await page.locator("#directions-button").click();
    check(
      "Endereço vazio mostra estado demonstrativo",
      (await page.locator("#dialog-description").innerText()).includes(
        "endereço",
      ),
    );
    await page.keyboard.press("Escape");
    await page.locator(".floating-contact").click();
    check(
      "Telefone vazio abre modal sem contato inventado",
      (await page.locator("#dialog-description").innerText()).includes(
        "versão oficial",
      ),
    );
    await page.keyboard.press("Escape");
    for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 950 });
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      check("Sem overflow horizontal em " + width + "px", !overflow);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator(".menu-toggle").click();
    check("Menu mobile abre", await page.locator("#mobile-nav").isVisible());
    await page.keyboard.press("Escape");
    check(
      "Escape fecha menu",
      !(await page.locator("#mobile-nav").isVisible()),
    );
    await page.locator(".menu-toggle").click();
    await page.locator('#mobile-nav a[href="#planos"]').first().click();
    check(
      "Menu fecha ao navegar",
      !(await page.locator("#mobile-nav").isVisible()),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    check(
      "Movimento reduzido desativa scroll suave",
      (await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      )) === "auto",
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: path.join(evidence, "mobile-hero.png") });
    check(
      "Nenhuma imagem está quebrada",
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        );
        return [...document.images].every((img) => img.naturalWidth > 0);
      }),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('[data-gallery="todas"]').click();
    await page.locator('[data-team="todas"]').click();
    await page.locator('[data-period="mensal"]').click();
    await page.locator('.unit-panel-tabs [data-unit="gloria"]').click();
    await page.evaluate(() =>
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible")),
    );
    for (const section of [
      "planos",
      "modalidades",
      "equipe",
      "unidades",
      "faq",
    ]) {
      await page
        .locator("#" + section)
        .screenshot({ path: path.join(evidence, section + ".png") });
    }
    await page.screenshot({
      path: path.join(evidence, "desktop-page.png"),
      fullPage: true,
    });
    if (errors.length) console.error("Browser errors:", errors);
    check("Sem erros JavaScript ou carregamento", errors.length === 0);
    fs.writeFileSync(
      path.join(evidence, "browser-results.json"),
      JSON.stringify(
        {
          status: "passed",
          widths: [320, 375, 430, 768, 1024, 1440, 1920],
          protocol: "file:",
          errors,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
