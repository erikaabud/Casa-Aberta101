const pool = require("./db");

let cacheTemQuantidadeNecessaria = null;

async function temColunaQuantidadeNecessaria() {
  if (cacheTemQuantidadeNecessaria !== null) return cacheTemQuantidadeNecessaria;
  try {
    const nomeBanco = process.env.DB_NAME || "rpg";
    const [linhas] = await pool.execute(
      `SELECT 1
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'item'
         AND COLUMN_NAME = 'quantidade_necessaria'
       LIMIT 1`,
      [nomeBanco],
    );
    cacheTemQuantidadeNecessaria = linhas.length > 0;
  } catch {
    cacheTemQuantidadeNecessaria = false;
  }
  return cacheTemQuantidadeNecessaria;
}

const CLASSES_BASE = [
  {
    nome: "Guerreiro",
    descricao: "Combatente de linha de frente, resistente e especialista em proteger a equipe.",
    habilidade: "Investida do Guardião",
    custoMana: 20,
  },
  {
    nome: "Ladino",
    descricao: "Especialista em precisão, armadilhas e movimentação rápida.",
    habilidade: "Passo das Sombras",
    custoMana: 15,
  },
  {
    nome: "Mago",
    descricao: "Canaliza energia arcana para manipular o campo de batalha.",
    habilidade: "Explosão Arcana",
    custoMana: 30,
  },
  {
    nome: "Clérigo",
    descricao: "Suporte sagrado capaz de sustentar e proteger aliados.",
    habilidade: "Benção Restauradora",
    custoMana: 18,
  },
];

const REGIOES_BASE = [
  {
    nome: "Floresta Sombria",
    descricao: "Bosques tomados por névoa onde relíquias antigas aguardam ser recuperadas.",
    missoes: [
      {
        nome: "Sinais na Mata",
        descricao: "Rastreie os artefatos perdidos e recupere as relíquias escondidas entre as raízes antigas.",
        tipo: "Equipe",
        classe: "Guerreiro",
        itens: [
          {
            nome: "Mapa de Casca",
            descricao: "Um fragmento cartográfico gravado em casca ancestral.",
            classe: "Guerreiro",
            caminhoImagem: "/modelos-3d/floresta_sombria/mapa-casca.glb",
          },
          {
            nome: "Semente Ancestral",
            descricao: "Núcleo vivo da floresta, usado para estabilizar o portal da região.",
            classe: "Guerreiro",
            caminhoImagem: "/modelos-3d/floresta_sombria/semente-ancestral.glb",
          },
        ],
      },
    ],
  },
  {
    nome: "Deserto Ardente",
    descricao: "Dunas abrasadoras escondem mecanismos solares e cofres soterrados.",
    missoes: [
      {
        nome: "Relíquias do Sol",
        descricao: "Atravesse as ruínas e recupere os itens que alimentam o obelisco solar.",
        tipo: "Equipe",
        classe: "Mago",
        itens: [
          {
            nome: "Ampulheta Solar",
            descricao: "Dispositivo de areia encantada usado para revelar inscrições antigas.",
            classe: "Mago",
            caminhoImagem: "/modelos-3d/deserto_ardente/ampulheta-solar.glb",
          },
          {
            nome: "Coração Solar",
            descricao: "Cristal flamejante capaz de reativar o núcleo do deserto.",
            classe: "Mago",
            caminhoImagem: "/modelos-3d/deserto_ardente/coracao-solar.glb",
          },
        ],
      },
    ],
  },
  {
    nome: "Montanhas Geladas",
    descricao: "Picos cobertos de gelo escondem câmaras ritualísticas e ecos congelados.",
    missoes: [
      {
        nome: "Ecos do Gelo",
        descricao: "Reúna os fragmentos perdidos para restaurar o altar das montanhas.",
        tipo: "Equipe",
        classe: "Clérigo",
        itens: [
          {
            nome: "Cristal Boreal",
            descricao: "Cristal polar que responde à energia da aurora.",
            classe: "Clérigo",
            caminhoImagem: "/modelos-3d/montanhas_geladas/cristal-boreal.glb",
          },
          {
            nome: "Fragmento Glacial",
            descricao: "Fragmento arcano necessário para estabilizar o selo da montanha.",
            classe: "Clérigo",
            caminhoImagem: "/modelos-3d/montanhas_geladas/fragmento-glacial.glb",
          },
          {
            nome: "Sino de Gelo",
            descricao: "Relíquia ritual usada para despertar o santuário gelado.",
            classe: "Clérigo",
            caminhoImagem: "/modelos-3d/montanhas_geladas/sino-de-gelo.glb",
          },
        ],
      },
    ],
  },
];

let promessaSeed = null;

async function buscarTotal(tabela) {
  const [linhas] = await pool.execute(`SELECT COUNT(*) AS total FROM ${tabela}`);
  return Number(linhas?.[0]?.total || 0);
}

async function buscarMapaClasses() {
  const [linhas] = await pool.execute(
    "SELECT id_classe, nome_classe FROM classe ORDER BY id_classe ASC",
  );

  return linhas.reduce((acumulador, classe) => {
    acumulador[classe.nome_classe] = classe.id_classe;
    return acumulador;
  }, {});
}

async function buscarMapaRegioes() {
  const [linhas] = await pool.execute(
    "SELECT id_regiao, nome_regiao FROM regiao ORDER BY id_regiao ASC",
  );

  return linhas.reduce((acumulador, regiao) => {
    acumulador[regiao.nome_regiao] = regiao.id_regiao;
    return acumulador;
  }, {});
}

async function garantirClassesBase() {
  for (const classe of CLASSES_BASE) {
    await pool.execute(
      "INSERT IGNORE INTO classe (nome_classe, descricao_classe) VALUES (?, ?)",
      [classe.nome, classe.descricao],
    );
  }
}

async function garantirHabilidadesBase() {
  const mapaClasses = await buscarMapaClasses();

  for (const classe of CLASSES_BASE) {
    const idClasse = mapaClasses[classe.nome];
    if (!idClasse) continue;

    const [linhas] = await pool.execute(
      "SELECT id_habilidade FROM habilidade WHERE id_classe = ? AND nome_habilidade = ? LIMIT 1",
      [idClasse, classe.habilidade],
    );

    if (linhas.length) continue;

    await pool.execute(
      `INSERT INTO habilidade (id_classe, nome_habilidade, custo_mp, uso_unico)
       VALUES (?, ?, ?, false)`,
      [idClasse, classe.habilidade, classe.custoMana],
    );
  }
}

async function garantirRegioesMissoesItensBase() {
  const temQtd = await temColunaQuantidadeNecessaria();
  for (const regiao of REGIOES_BASE) {
    await pool.execute(
      "INSERT IGNORE INTO regiao (nome_regiao, descricao_regiao) VALUES (?, ?)",
      [regiao.nome, regiao.descricao],
    );
  }

  const mapaRegioes = await buscarMapaRegioes();
  const mapaClasses = await buscarMapaClasses();

  for (const regiao of REGIOES_BASE) {
    const idRegiao = mapaRegioes[regiao.nome];
    if (!idRegiao) continue;

    for (const missao of regiao.missoes) {
      const idClasse = mapaClasses[missao.classe] || null;

      let idMissao = null;
      const [missaoExistente] = await pool.execute(
        "SELECT id_missao FROM missao WHERE nome_missao = ? LIMIT 1",
        [missao.nome],
      );

      if (missaoExistente.length) {
        idMissao = missaoExistente[0].id_missao;
      } else {
        const [resultado] = await pool.execute(
          `INSERT INTO missao (nome_missao, descricao_missao, id_regiao, id_classe, tipo_missao)
           VALUES (?, ?, ?, ?, ?)`,
          [missao.nome, missao.descricao, idRegiao, idClasse, missao.tipo],
        );
        idMissao = resultado.insertId;
      }

      for (const item of missao.itens) {
        const idClasseItem = mapaClasses[item.classe] || idClasse;
        if (!idClasseItem) continue;

        const [itemExistente] = await pool.execute(
          "SELECT id_item FROM item WHERE nome_item = ? LIMIT 1",
          [item.nome],
        );

        if (itemExistente.length) continue;

        if (temQtd) {
          await pool.execute(
            `INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, quantidade_necessaria, caminho_imagem)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.nome,
              item.descricao,
              idMissao,
              idClasseItem,
              item.quantidadeNecessaria || 1,
              item.caminhoImagem,
            ],
          );
        } else {
          await pool.execute(
            `INSERT INTO item (nome_item, descricao_item, id_missao, id_classe, caminho_imagem)
             VALUES (?, ?, ?, ?, ?)`,
            [item.nome, item.descricao, idMissao, idClasseItem, item.caminhoImagem],
          );
        }
      }
    }
  }
}

async function garantirDadosBase() {
  const podePopular =
    (process.env.AUTO_SEED_GAME_DATA || "true") === "true" ||
    (process.env.AUTO_SEED_CLASSES || "true") === "true";

  if (!podePopular) {
    return;
  }

  if (!promessaSeed) {
    promessaSeed = (async () => {
      const totalClasses = await buscarTotal("classe");
      if (totalClasses === 0) {
        await garantirClassesBase();
      }

      const totalHabilidades = await buscarTotal("habilidade");
      if (totalHabilidades === 0) {
        await garantirHabilidadesBase();
      } else {
        await garantirHabilidadesBase();
      }

      const totalRegioes = await buscarTotal("regiao");
      const totalMissoes = await buscarTotal("missao");
      const totalItens = await buscarTotal("item");

      if (totalRegioes === 0 || totalMissoes === 0 || totalItens === 0) {
        await garantirRegioesMissoesItensBase();
      }
    })();
  }

  try {
    await promessaSeed;
  } catch (erro) {
    promessaSeed = null;
    throw erro;
  }
}

module.exports = {
  garantirDadosBase,
};
