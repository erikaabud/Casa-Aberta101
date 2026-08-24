const pool = require("../config/db");
const { garantirDadosBase } = require("../config/seedData");

function slugificarRegiao(nome = "") {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function buscarEquipeEClasseDoUsuario(idUsuario) {
  const [linhas] = await pool.execute(
    `SELECT
        u.id_usuario,
        u.nome_usuario,
        e.id_equipe,
        e.nome_equipe,
        e.codigo,
        e.pontuacao,
        e.status,
        e.id_lider,
        c.id_classe,
        c.nome_classe,
        c.descricao_classe
     FROM usuario u
     LEFT JOIN equipe_usuario eu
       ON eu.id_usuario = u.id_usuario
     LEFT JOIN equipe e
       ON e.id_equipe = eu.id_equipe
     LEFT JOIN classe c
       ON c.id_classe = eu.id_classe
     WHERE u.id_usuario = ?
     LIMIT 1`,
    [idUsuario],
  );

  return linhas[0] || null;
}

async function listarMembrosDaEquipe(idEquipe) {
  const [linhas] = await pool.execute(
    `SELECT
        u.id_usuario,
        u.nome_usuario,
        eu.id_classe,
        c.nome_classe,
        CASE WHEN e.id_lider = u.id_usuario THEN true ELSE false END AS lider
     FROM equipe_usuario eu
     INNER JOIN usuario u
       ON u.id_usuario = eu.id_usuario
     INNER JOIN equipe e
       ON e.id_equipe = eu.id_equipe
     LEFT JOIN classe c
       ON c.id_classe = eu.id_classe
     WHERE eu.id_equipe = ?
     ORDER BY lider DESC, u.nome_usuario ASC`,
    [idEquipe],
  );

  return linhas;
}

async function listarInventarioDoUsuario(idUsuario) {
  const [linhas] = await pool.execute(
    `SELECT
        ei.id_item,
        i.nome_item,
        i.descricao_item,
        ei.estado_item,
        ei.quantidade,
        i.id_missao,
        m.nome_missao,
        r.id_regiao,
        r.nome_regiao,
        i.caminho_imagem
     FROM equipe_item ei
     INNER JOIN item i
       ON i.id_item = ei.id_item
     INNER JOIN missao m
       ON m.id_missao = i.id_missao
     INNER JOIN regiao r
       ON r.id_regiao = m.id_regiao
     WHERE ei.id_usuario = ?
     ORDER BY r.id_regiao ASC, m.id_missao ASC, i.id_item ASC`,
    [idUsuario],
  );

  return linhas.map((item) => ({
    ...item,
    regiao_slug: slugificarRegiao(item.nome_regiao),
  }));
}

async function listarEstruturaDoJogo({ idUsuario, idEquipe }) {
  const [linhas] = await pool.execute(
    `SELECT
        r.id_regiao,
        r.nome_regiao,
        r.descricao_regiao,
        m.id_missao,
        m.nome_missao,
        m.descricao_missao,
        m.tipo_missao,
        m.id_classe AS missao_id_classe,
        cm.nome_classe AS missao_nome_classe,
        COALESCE(p.situacao, 'Não concluido') AS situacao_missao,
        COALESCE(p.pontos_obtidos, 0) AS pontos_obtidos,
        i.id_item,
        i.nome_item,
        i.descricao_item,
        i.caminho_imagem,
        ci.nome_classe AS item_nome_classe,
        CASE
          WHEN EXISTS(
            SELECT 1
            FROM equipe_item ei_usuario
            WHERE ei_usuario.id_usuario = ?
              AND ei_usuario.id_item = i.id_item
          ) THEN true
          ELSE false
        END AS coletado_por_usuario,
        CASE
          WHEN EXISTS(
            SELECT 1
            FROM equipe_item ei_equipe
            INNER JOIN equipe_usuario eu_equipe
              ON eu_equipe.id_usuario = ei_equipe.id_usuario
            WHERE eu_equipe.id_equipe = ?
              AND ei_equipe.id_item = i.id_item
          ) THEN true
          ELSE false
        END AS coletado_pela_equipe
     FROM regiao r
     LEFT JOIN missao m
       ON m.id_regiao = r.id_regiao
     LEFT JOIN classe cm
       ON cm.id_classe = m.id_classe
     LEFT JOIN progresso p
       ON p.id_equipe = ?
      AND p.id_missao = m.id_missao
     LEFT JOIN item i
       ON i.id_missao = m.id_missao
     LEFT JOIN classe ci
       ON ci.id_classe = i.id_classe
     ORDER BY r.id_regiao ASC, m.id_missao ASC, i.id_item ASC`,
    [idUsuario, idEquipe, idEquipe],
  );

  const regioes = [];
  const mapaRegioes = new Map();

  for (const linha of linhas) {
    if (!mapaRegioes.has(linha.id_regiao)) {
      const regiao = {
        id_regiao: linha.id_regiao,
        nome_regiao: linha.nome_regiao,
        descricao_regiao: linha.descricao_regiao,
        slug: slugificarRegiao(linha.nome_regiao),
        missoes: [],
      };

      mapaRegioes.set(linha.id_regiao, regiao);
      regioes.push(regiao);
    }

    if (!linha.id_missao) {
      continue;
    }

    const regiao = mapaRegioes.get(linha.id_regiao);
    let missao = regiao.missoes.find((item) => item.id_missao === linha.id_missao);

    if (!missao) {
      missao = {
        id_missao: linha.id_missao,
        nome_missao: linha.nome_missao,
        descricao_missao: linha.descricao_missao,
        tipo_missao: linha.tipo_missao,
        situacao: linha.situacao_missao,
        pontos_obtidos: linha.pontos_obtidos,
        classe: linha.missao_nome_classe,
        itens: [],
      };
      regiao.missoes.push(missao);
    }

    if (!linha.id_item) {
      continue;
    }

    missao.itens.push({
      id_item: linha.id_item,
      nome_item: linha.nome_item,
      descricao_item: linha.descricao_item,
      caminho_imagem: linha.caminho_imagem,
      classe: linha.item_nome_classe,
      coletado_por_usuario: Boolean(linha.coletado_por_usuario),
      coletado_pela_equipe: Boolean(linha.coletado_pela_equipe),
    });
  }

  for (const regiao of regioes) {
    regiao.missoes = regiao.missoes.map((missao) => {
      const totalItens = missao.itens.length;
      const itensColetadosEquipe = missao.itens.filter((item) => item.coletado_pela_equipe).length;
      const itensColetadosUsuario = missao.itens.filter((item) => item.coletado_por_usuario).length;
      const concluida =
        missao.situacao === "Concluido" ||
        (totalItens > 0 && itensColetadosEquipe >= totalItens);

      return {
        ...missao,
        total_itens: totalItens,
        itens_coletados_equipe: itensColetadosEquipe,
        itens_coletados_usuario: itensColetadosUsuario,
        concluida,
      };
    });
  }

  return regioes;
}

async function obterFichaDoJogador(idUsuario) {
  await garantirDadosBase();

  const baseJogador = await buscarEquipeEClasseDoUsuario(idUsuario);
  if (!baseJogador) {
    return null;
  }

  const equipe = baseJogador.id_equipe
    ? {
        id_equipe: baseJogador.id_equipe,
        nome_equipe: baseJogador.nome_equipe,
        codigo: baseJogador.codigo,
        pontuacao: baseJogador.pontuacao,
        status: baseJogador.status,
        id_lider: baseJogador.id_lider,
      }
    : null;

  if (!equipe) {
    return {
      usuario: {
        id_usuario: baseJogador.id_usuario,
        nome_usuario: baseJogador.nome_usuario,
      },
      equipe: null,
      personagem: {
        nome: baseJogador.nome_usuario,
        classe: baseJogador.nome_classe || null,
        descricao_classe: baseJogador.descricao_classe || "",
      },
      membros: [],
      inventario: [],
      regioes: [],
    };
  }

  const [membros, inventario, regioes] = await Promise.all([
    listarMembrosDaEquipe(equipe.id_equipe),
    listarInventarioDoUsuario(idUsuario),
    listarEstruturaDoJogo({ idUsuario, idEquipe: equipe.id_equipe }),
  ]);

  return {
    usuario: {
      id_usuario: baseJogador.id_usuario,
      nome_usuario: baseJogador.nome_usuario,
    },
    equipe,
    personagem: {
      nome: baseJogador.nome_usuario,
      classe: baseJogador.nome_classe || "Sem classe",
      descricao_classe: baseJogador.descricao_classe || "",
    },
    membros,
    inventario,
    regioes,
  };
}

async function atualizarProgressoDaMissao({ idEquipe, idMissao, conexao }) {
  const executor = conexao || pool;

  const [totais] = await executor.execute(
    `SELECT
        COUNT(DISTINCT i.id_item) AS total_itens,
        COUNT(DISTINCT CASE WHEN eu.id_usuario IS NOT NULL THEN ei.id_item END) AS itens_coletados
     FROM item i
     LEFT JOIN equipe_item ei
       ON ei.id_item = i.id_item
     LEFT JOIN equipe_usuario eu
       ON eu.id_usuario = ei.id_usuario
      AND eu.id_equipe = ?
     WHERE i.id_missao = ?`,
    [idEquipe, idMissao],
  );

  const totalItens = Number(totais?.[0]?.total_itens || 0);
  const itensColetados = Number(totais?.[0]?.itens_coletados || 0);
  const concluida = totalItens > 0 && itensColetados >= totalItens;

  await executor.execute(
    `INSERT INTO progresso (id_equipe, id_missao, situacao, pontos_obtidos)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       situacao = VALUES(situacao),
       pontos_obtidos = VALUES(pontos_obtidos)`,
    [idEquipe, idMissao, concluida ? "Concluido" : "Não concluido", concluida ? totalItens * 100 : 0],
  );

  return {
    totalItens,
    itensColetados,
    concluida,
  };
}

async function coletarItemPorMarcador({ idUsuario, idItem, marcador }) {
  await garantirDadosBase();

  if (String(marcador || "").toLowerCase() !== "hiro") {
    const erro = new Error("O marcador informado é inválido. Use o marcador HIRO.");
    erro.status = 400;
    throw erro;
  }

  const jogador = await buscarEquipeEClasseDoUsuario(idUsuario);
  if (!jogador?.id_equipe) {
    const erro = new Error("Você precisa entrar em uma equipe antes de coletar itens.");
    erro.status = 409;
    throw erro;
  }

  const [itens] = await pool.execute(
    `SELECT
        i.id_item,
        i.nome_item,
        i.descricao_item,
        i.id_missao,
        i.caminho_imagem,
        m.nome_missao,
        r.nome_regiao
     FROM item i
     INNER JOIN missao m
       ON m.id_missao = i.id_missao
     INNER JOIN regiao r
       ON r.id_regiao = m.id_regiao
     WHERE i.id_item = ?
     LIMIT 1`,
    [idItem],
  );

  const item = itens[0];
  if (!item) {
    const erro = new Error("Item não encontrado para coleta.");
    erro.status = 404;
    throw erro;
  }

  const [jaColetado] = await pool.execute(
    "SELECT id_item FROM equipe_item WHERE id_usuario = ? AND id_item = ? LIMIT 1",
    [idUsuario, idItem],
  );

  if (jaColetado.length) {
    const progresso = await atualizarProgressoDaMissao({
      idEquipe: jogador.id_equipe,
      idMissao: item.id_missao,
    });

    return {
      ja_coletado: true,
      item,
      progresso,
      mensagem: "Este item já foi coletado e já está no seu inventário.",
    };
  }

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    await conexao.execute(
      `INSERT INTO equipe_item (id_usuario, id_item, estado_item, quantidade)
       VALUES (?, ?, 'Normal', 1)`,
      [idUsuario, idItem],
    );

    const progresso = await atualizarProgressoDaMissao({
      idEquipe: jogador.id_equipe,
      idMissao: item.id_missao,
      conexao,
    });

    await conexao.commit();

    return {
      ja_coletado: false,
      item,
      progresso,
      mensagem: `Item "${item.nome_item}" coletado com sucesso.`,
    };
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

module.exports = {
  obterFichaDoJogador,
  coletarItemPorMarcador,
};
