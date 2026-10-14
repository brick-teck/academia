const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PULSE_QA_MODULE || "playwright");
const AxeBuilder = require(
  process.env.PULSE_QA_AXE || "@axe-core/playwright",
).default;

(async () => {
  const root = path.resolve(__dirname, "..");
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.PULSE_QA_BROWSER ||
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const reports = [];
  try {
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
    });
    for (const state of ["desktop", "modal", "mobile"]) {
      if (state === "modal") await page.locator('[data-plan="pro"]').click();
      if (state === "mobile") {
        await page.keyboard.press("Escape");
        await page.setViewportSize({ width: 375, height: 812 });
      }
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      reports.push({
        state,
        violations: report.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          description: item.description,
          nodes: item.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        })),
      });
    }
    fs.writeFileSync(
      path.join(__dirname, "evidence/accessibility-results.json"),
      JSON.stringify(reports, null, 2),
    );
    console.log(JSON.stringify(reports, null, 2));
    assert.equal(
      reports.reduce((total, report) => total + report.violations.length, 0),
      0,
      "Axe não deve detectar violações WCAG",
    );

    // Configuração é exercitada só na memória desta página de testes.
    await page.evaluate(() => {
      ACADEMIA.unidades[1].endereco = "Endereço de teste configurável";
      ACADEMIA.unidades[1].telefone = "5511999999999";
      window.__openedUrls = [];
      window.open = (url) => {
        window.__openedUrls.push(url);
        return null;
      };
    });
    await page.locator('.unit-panel-tabs [data-unit="laguna"]').click();
    assert.ok(
      (await page.locator("#map-container").innerText()).includes(
        "Endereço de teste configurável",
      ),
    );
    await page.locator("#directions-button").click();
    await page.locator(".floating-contact").click();
    const links = await page.evaluate(() => window.__openedUrls);
    assert.ok(
      links[0].startsWith("https://www.google.com/maps/search/?api=1&query="),
    );
    assert.ok(links[1].startsWith("https://wa.me/5511999999999?text="));
    assert.ok(decodeURIComponent(links[1]).includes("Laguna"));
    console.log(
      "PASS Maps e WhatsApp usam somente configuração, sem abrir contatos reais",
    );
    await page.evaluate(() => {
      ACADEMIA.professores = [];
      ACADEMIA.galeria = [];
    });
    await page.locator('[data-team="laguna"]').click();
    await page.locator('[data-gallery="laguna"]').click();
    assert.ok(
      (await page.locator("#team-grid").innerText()).includes("Não há perfis"),
    );
    assert.ok(
      (await page.locator("#gallery-grid").innerText()).includes(
        "Não há fotos",
      ),
    );
    console.log("PASS Filtros vazios oferecem orientação");
    await page.evaluate(() => {
      ACADEMIA.unidades[1].mapsEmbedUrl =
        "https://www.google.com/maps/embed?pb=test";
    });
    await page.locator('.unit-panel-tabs [data-unit="gloria"]').click();
    await page.locator('.unit-panel-tabs [data-unit="laguna"]').click();
    assert.equal(await page.locator("#map-container iframe").count(), 1);
    console.log("PASS Google Maps Embed exige endereço configurado");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
