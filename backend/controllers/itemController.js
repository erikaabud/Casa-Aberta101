const itemModel = require("../models/itemModel");
const equipeModel = require("../models/equipeModel");

async function listar(req, res) {
  try {
    const itens = await itemModel.listarItens();
    return res.json(itens);
  } catch {
    return res.status(500).json({ erro: "Falha ao listar itens." });
  }
}

async function listarItensDaMinhaEquipe(req, res) {
  const id_usuario = req.usuario?.id_usuario;

  try {
    const equipe = await equipeModel.buscarEquipeDoUsuario(id_usuario);
    if (!equipe) return res.status(404).json({ erro: "Usuário ainda não está em uma equipe." });

    const itens = await itemModel.listarItensDaEquipe(equipe.id_equipe);
    return res.json({ equipe, itens });
  } catch {
    return res.status(500).json({ erro: "Falha ao listar itens da equipe." });
  }
}

module.exports = { listar, listarItensDaMinhaEquipe };

