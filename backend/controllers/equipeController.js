const equipeModel = require("../models/equipeModel");

async function criar(req, res) {
  const id_usuario = req.usuario?.id_usuario;
  const nome_equipe = String(req.body?.nome_equipe || "").trim();
  const id_classe = Number(req.body?.id_classe);

  if (!nome_equipe) {
    return res.status(400).json({ erro: "Nome da equipe é obrigatório." });
  }
  if (!id_classe) {
    return res.status(400).json({ erro: "Classe é obrigatória." });
  }

  try {
    const equipe = await equipeModel.criarEquipe({ id_usuario, nome_equipe, id_classe });
    return res.status(201).json({ equipe });
  } catch (erro) {
    const status = erro.status || 500;
    return res.status(status).json({ erro: erro.message || "Falha ao criar equipe." });
  }
}

async function entrar(req, res) {
  const id_usuario = req.usuario?.id_usuario;
  const codigo = String(req.body?.codigo || "").trim().toUpperCase();
  const id_classe = Number(req.body?.id_classe);

  if (codigo.length !== 6) {
    return res.status(400).json({ erro: "Token inválido." });
  }
  if (!id_classe) {
    return res.status(400).json({ erro: "Classe é obrigatória." });
  }

  try {
    const equipe = await equipeModel.entrarNaEquipe({ id_usuario, codigo, id_classe });
    return res.json({ equipe });
  } catch (erro) {
    const status = erro.status || 500;
    return res.status(status).json({ erro: erro.message || "Falha ao entrar na equipe." });
  }
}

async function minha(req, res) {
  const id_usuario = req.usuario?.id_usuario;
  try {
    const equipe = await equipeModel.buscarEquipeDoUsuario(id_usuario);
    return res.json(equipe);
  } catch {
    return res.status(500).json({ erro: "Falha ao buscar equipe." });
  }
}

module.exports = { criar, entrar, minha };

