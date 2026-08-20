const poderesModel = require("../models/poderesModel");
const pool = require("../config/db");

// Estado temporário da partida
const estadoJogadores = new Map();

const MP_INICIAL = 100;


// Lista todos os poderes
function listar(req, res) {
  const poderes = poderesModel.listarPoderes();

  return res.json(poderes);
}


// Retorna o estado atual do jogador
function estado(req, res) {
  const id_usuario = req.usuario.id_usuario;

  if (!estadoJogadores.has(id_usuario)) {
    estadoJogadores.set(id_usuario, {
      mpAtual: MP_INICIAL,
      chaveDeCeraUsada: false,
    });
  }

  const jogador = estadoJogadores.get(id_usuario);

  return res.json({
    mpAtual: jogador.mpAtual,
    mpMaximo: MP_INICIAL,
    chaveDeCeraUsada: jogador.chaveDeCeraUsada,
  });
}


// Usa um poder
async function usar(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_poder } = req.body;

    // Procura o poder
    const poder = poderesModel.buscarPoderPorId(id_poder);

    if (!poder) {
      return res.status(404).json({
        erro: "Poder não encontrado.",
      });
    }


    // Cria o estado do jogador caso ainda não exista
    if (!estadoJogadores.has(id_usuario)) {
      estadoJogadores.set(id_usuario, {
        mpAtual: MP_INICIAL,
        chaveDeCeraUsada: false,
      });
    }

    const jogador = estadoJogadores.get(id_usuario);


    // =====================================
    // CHAVE DE CERA
    // =====================================

    if (poder.nome === "Chave de Cera") {

      if (jogador.chaveDeCeraUsada) {
        return res.status(400).json({
          erro: "A Chave de Cera já foi usada nesta partida.",
        });
      }

      jogador.chaveDeCeraUsada = true;

      return res.json({
        sucesso: true,
        mensagem: "Chave de Cera utilizada com sucesso!",
        mpAtual: jogador.mpAtual,
      });
    }


    // =====================================
    // BUSCAR CLASSE DO JOGADOR
    // =====================================

    const [resultado] = await pool.execute(
      `SELECT c.nome_classe
       FROM equipe_usuario eu
       INNER JOIN classe c
         ON c.id_classe = eu.id_classe
       WHERE eu.id_usuario = ?
       LIMIT 1`,
      [id_usuario]
    );


    if (resultado.length === 0) {
      return res.status(404).json({
        erro: "Classe do jogador não encontrada.",
      });
    }


    const classeJogador = resultado[0].nome_classe;


    // =====================================
    // VERIFICAR SE O PODER PERTENCE À CLASSE
    // =====================================

    if (poder.classe !== classeJogador) {
      return res.status(403).json({
        erro: "Esse poder não pertence à sua classe.",
        classeJogador: classeJogador,
      });
    }


    // =====================================
    // VERIFICAR MP
    // =====================================

    if (jogador.mpAtual < poder.custoMP) {
      return res.status(400).json({
        erro: "MP insuficiente.",
        mpAtual: jogador.mpAtual,
        custoMP: poder.custoMP,
      });
    }


    // =====================================
    // DESCONTAR MP
    // =====================================

    jogador.mpAtual -= poder.custoMP;


    return res.json({
      sucesso: true,
      mensagem: `${poder.nome} utilizado com sucesso!`,
      poder: poder.nome,
      custoMP: poder.custoMP,
      mpAtual: jogador.mpAtual,
    });

  } catch (erro) {

    console.error("Erro ao utilizar poder:", erro);

    return res.status(500).json({
      erro: "Erro interno ao utilizar poder.",
    });
  }
}


module.exports = {
  listar,
  estado,
  usar,
};