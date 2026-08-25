const pool = require("../config/db");

async function listarRegioes() {
  const [linhas] = await pool.execute(
    "SELECT id_regiao, nome_regiao, descricao_regiao FROM regiao ORDER BY id_regiao ASC",
  );
  return linhas;
}

async function listarLugaresPorRegiao(id_regiao) {
  const [linhas] = await pool.execute(
    `SELECT
        id_missao AS id_lugar,
        nome_missao AS nome_lugar,
        id_regiao,
        descricao_missao AS descricao_lugar
     FROM missao
     WHERE id_regiao = ?
     ORDER BY id_missao ASC`,
    [id_regiao],
  );
  return linhas;
}

async function listarNpcs({ id_regiao = null, id_lugar = null } = {}) {
  const filtros = [];
  const valores = [];

  if (id_regiao) {
    filtros.push("m.id_regiao = ?");
    valores.push(id_regiao);
  }
  if (id_lugar) {
    filtros.push("n.id_missao = ?");
    valores.push(id_lugar);
  }

  const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
  const [linhas] = await pool.execute(
    `SELECT
        n.id_npc,
        n.nome_npc,
        n.tipo_npc,
        n.descricao_npc,
        m.id_regiao,
        n.id_missao AS id_lugar
     FROM npc n
     LEFT JOIN missao m
       ON m.id_missao = n.id_missao
     ${where}
     ORDER BY n.id_npc ASC`,
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

