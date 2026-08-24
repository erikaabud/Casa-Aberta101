const pool = require("../config/db");

async function listarItens() {
  const [linhas] = await pool.execute(
    "SELECT id_item, nome_item, descricao_item FROM item ORDER BY id_item ASC",
  );
  return linhas;
}

async function listarItensDaEquipe(id_equipe) {
  const [linhas] = await pool.execute(
    `SELECT ei.id_item, i.nome_item, i.descricao_item, ei.estado_item, ei.quantidade
     FROM equipe_item ei
     JOIN equipe_usuario eu ON eu.id_usuario = ei.id_usuario
     JOIN item i ON i.id_item = ei.id_item
     WHERE eu.id_equipe = ?
     ORDER BY i.nome_item ASC`,
    [id_equipe],
  );
  return linhas;
}

module.exports = { listarItens, listarItensDaEquipe };

