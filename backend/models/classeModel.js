const pool = require("../config/db");

async function listarClasses() {
  const [linhas] = await pool.execute(
    "SELECT id_classe, nome_classe, habilidade, descricao_classe FROM classe ORDER BY id_classe ASC",
  );
  return linhas;
}

async function contarClasses() {
  const [linhas] = await pool.execute("SELECT COUNT(*) AS total FROM classe");
  return Number(linhas?.[0]?.total || 0);
}

async function inserirClassesPadrao() {
  const classes = [
    { nome: "Guerreiro", habilidade: "Força bruta", descricao: "Resiste a danos e protege a equipe." },
    { nome: "Mago", habilidade: "Magia ancestral", descricao: "Domina magia e feitiços." },
    { nome: "Paladino", habilidade: "Proteção", descricao: "Defesa e cura." },
    { nome: "Ladino", habilidade: "Furtividade", descricao: "Ataques rápidos e precisão." },
    { nome: "Necromante", habilidade: "Sombras", descricao: "Invoca energia das trevas e maldições." },
  ];

  for (const item of classes) {
    // IGNORE evita falha caso já exista
    await pool.execute(
      "INSERT IGNORE INTO classe (nome_classe, habilidade, descricao_classe) VALUES (?, ?, ?)",
      [item.nome, item.habilidade, item.descricao],
    );
  }
}

module.exports = { listarClasses, contarClasses, inserirClassesPadrao };

