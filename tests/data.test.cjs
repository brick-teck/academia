const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function loadConfig() {
  const filename = path.join(__dirname, "../js/data.js");
  assert.ok(
    fs.existsSync(filename),
    "A configuração central data.js deve existir",
  );
  const context = {};
  vm.runInNewContext(
    fs.readFileSync(filename, "utf8") + "\nthis.config = ACADEMIA;",
    context,
  );
  return context.config;
}
test("Demonstração não publica endereço, telefone ou parceria oficial inventados", () => {
  const data = loadConfig();
  assert.equal(data.unidades.length, 2);
  for (const unit of data.unidades) {
    assert.equal(unit.endereco, "");
    assert.equal(unit.telefone, "");
  }
  assert.equal(data.contatos.whatsapp, "");
  assert.equal(data.convenios.parceriaConfirmada, false);
});
test("Todos os períodos possuem duração, total e os três planos demonstrativos", () => {
  const data = loadConfig();
  for (const unit of data.unidades) {
    for (const [id, period] of Object.entries(data.periodos)) {
      assert.ok(period.meses > 0);
      for (const plan of data.planos) {
        const price = unit.precos[id][plan.id];
        assert.ok(Number.isFinite(price) && price > 0);
        assert.ok(Number.isFinite(price * period.meses));
      }
    }
  }
  assert.equal(data.unidades[0].precos.mensal.start, 89.9);
  assert.equal(data.unidades[0].precos.mensal.pro, 119.9);
  assert.equal(data.unidades[0].precos.mensal.max, 149.9);
});
test("Recursos locais existem e galeria/equipe referenciam somente unidades válidas", () => {
  const data = loadConfig();
  const units = new Set(data.unidades.map((unit) => unit.id));
  for (const item of [...data.galeria, ...data.professores]) {
    assert.ok(units.has(item.unidade));
    assert.ok(
      fs.existsSync(path.join(__dirname, "..", item.imagem)),
      item.imagem,
    );
  }
  for (const unit of data.unidades) {
    assert.ok(fs.existsSync(path.join(__dirname, "..", unit.imagemHero)));
  }
});
