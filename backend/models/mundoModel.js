const pool = require("../config/db");

async function listarRegioes() {
  const [linhas] = await pool.execute(
    "SELECT id_regiao, nome_regiao, descricao_regiao FROM regiao ORDER BY id_regiao ASC",
  );
  return linhas;
}

async function listarLugaresPorRegiao(id_regiao) {
  const [linhas] = await pool.execute(
    "SELECT id_lugar, nome_lugar, id_regiao, descricao_lugar FROM lugar WHERE id_regiao = ? ORDER BY id_lugar ASC",
    [id_regiao],
  );
  return linhas;
}

async function listarNpcs({ id_regiao = null, id_lugar = null } = {}) {
  const filtros = [];
  const valores = [];

  if (id_regiao) {
    filtros.push("id_regiao = ?");
    valores.push(id_regiao);
  }
  if (id_lugar) {
    filtros.push("id_lugar = ?");
    valores.push(id_lugar);
  }

  const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
  const [linhas] = await pool.execute(
    `SELECT id_npc, nome_npc, tipo_npc, descricao_npc, id_regiao, id_lugar FROM npc ${where} ORDER BY id_npc ASC`,
    valores,
  );
  return linhas;
}

async function listarDialogosPorNpc(id_npc) {
  const [linhas] = await pool.execute(
    "SELECT id_dialogo, id_npc, ordem_dialogo, texto_dialogo FROM dialogo WHERE id_npc = ? ORDER BY ordem_dialogo ASC",
    [id_npc],
  );
  return linhas;
}

module.exports = {
  listarRegioes,
  listarLugaresPorRegiao,
  listarNpcs,
  listarDialogosPorNpc,
};

