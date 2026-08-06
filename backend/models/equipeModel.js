const pool = require("../config/db");

function gerarCodigoEquipe() {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < 6; i += 1) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

async function buscarEquipePorCodigo(codigo) {
  const [linhas] = await pool.execute(
    "SELECT id_equipe, nome_equipe, codigo, pontuacao, status, id_lider FROM equipe WHERE codigo = ?",
    [codigo],
  );
  return linhas[0] || null;
}

async function buscarEquipePorId(id_equipe) {
  const [linhas] = await pool.execute(
    "SELECT id_equipe, nome_equipe, codigo, pontuacao, status, id_lider FROM equipe WHERE id_equipe = ?",
    [id_equipe],
  );
  return linhas[0] || null;
}

async function buscarEquipeDoUsuario(id_usuario) {
  const [linhas] = await pool.execute(
    `SELECT e.id_equipe, e.nome_equipe, e.codigo, e.pontuacao, e.status, e.id_lider
     FROM equipe_usuario eu
     JOIN equipe e ON e.id_equipe = eu.id_equipe
     WHERE eu.id_usuario = ?
     LIMIT 1`,
    [id_usuario],
  );
  return linhas[0] || null;
}

async function contarMembros(id_equipe) {
  const [linhas] = await pool.execute(
    "SELECT COUNT(*) AS total FROM equipe_usuario WHERE id_equipe = ?",
    [id_equipe],
  );
  return Number(linhas?.[0]?.total || 0);
}

async function usuarioJaEstaNaEquipe(id_usuario) {
  const [linhas] = await pool.execute(
    "SELECT id_equipe FROM equipe_usuario WHERE id_usuario = ? LIMIT 1",
    [id_usuario],
  );
  return Boolean(linhas.length);
}

async function criarEquipe({ id_usuario, nome_equipe, id_classe }) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const jaEsta = await usuarioJaEstaNaEquipe(id_usuario);
    if (jaEsta) {
      const erro = new Error("Usuário já está em uma equipe.");
      erro.status = 409;
      throw erro;
    }

    let codigo = "";
    let id_equipe = null;

    for (let tentativa = 0; tentativa < 8; tentativa += 1) {
      codigo = gerarCodigoEquipe();
      try {
        const [resultado] = await conexao.execute(
          "INSERT INTO equipe (nome_equipe, codigo, status) VALUES (?, ?, 'Incompleta')",
          [nome_equipe, codigo],
        );
        id_equipe = resultado.insertId;
        break;
      } catch (erro) {
        if (erro && erro.code === "ER_DUP_ENTRY") continue;
        throw erro;
      }
    }

    if (!id_equipe) {
      const erro = new Error("Não foi possível gerar um token único de equipe.");
      erro.status = 500;
      throw erro;
    }

    // Primeiro cria o vínculo do líder na equipe_usuario
    await conexao.execute(
      "INSERT INTO equipe_usuario (id_equipe, id_usuario, id_classe) VALUES (?, ?, ?)",
      [id_equipe, id_usuario, id_classe],
    );

    // Depois define o líder (FK composta exige existir em equipe_usuario)
    await conexao.execute(
      "UPDATE equipe SET id_lider = ? WHERE id_equipe = ?",
      [id_usuario, id_equipe],
    );

    await conexao.commit();

    const equipe = await buscarEquipePorId(id_equipe);
    return equipe;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function entrarNaEquipe({ id_usuario, codigo, id_classe, limiteMembros = 4 }) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    const jaEsta = await usuarioJaEstaNaEquipe(id_usuario);
    if (jaEsta) {
      const erro = new Error("Usuário já está em uma equipe.");
      erro.status = 409;
      throw erro;
    }

    const equipe = await buscarEquipePorCodigo(codigo);
    if (!equipe) {
      const erro = new Error("Equipe não encontrada para este token.");
      erro.status = 404;
      throw erro;
    }

    const total = await contarMembros(equipe.id_equipe);
    if (total >= limiteMembros) {
      const erro = new Error("A equipe já está completa.");
      erro.status = 409;
      throw erro;
    }

    await conexao.execute(
      "INSERT INTO equipe_usuario (id_equipe, id_usuario, id_classe) VALUES (?, ?, ?)",
      [equipe.id_equipe, id_usuario, id_classe],
    );

    // Se era incompleta, passa a jogar assim que 2+ membros entram (pode ajustar depois)
    const novoTotal = total + 1;
    if (equipe.status === "Incompleta" && novoTotal >= 2) {
      await conexao.execute(
        "UPDATE equipe SET status = 'Jogando' WHERE id_equipe = ?",
        [equipe.id_equipe],
      );
    }

    await conexao.commit();

    return await buscarEquipePorId(equipe.id_equipe);
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

module.exports = {
  buscarEquipeDoUsuario,
  criarEquipe,
  entrarNaEquipe,
};

