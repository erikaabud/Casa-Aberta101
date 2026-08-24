const pool = require("../config/db");

async function listarClasses() {
  const [linhas] = await pool.execute(
    `SELECT
        c.id_classe,
        c.nome_classe,
        c.descricao_classe,
        COALESCE(MIN(h.nome_habilidade), 'Sem habilidade cadastrada') AS habilidade
     FROM classe c
     LEFT JOIN habilidade h
       ON h.id_classe = c.id_classe
     GROUP BY c.id_classe, c.nome_classe, c.descricao_classe
     ORDER BY c.id_classe ASC`,
  );
  return linhas;
}

async function contarClasses() {
  const [linhas] = await pool.execute("SELECT COUNT(*) AS total FROM classe");
  return Number(linhas?.[0]?.total || 0);
}

module.exports = { listarClasses, contarClasses };

