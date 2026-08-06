const mundoModel = require("../models/mundoModel");

async function listarRegioes(req, res) {
  try {
    const regioes = await mundoModel.listarRegioes();
    return res.json(regioes);
  } catch {
    return res.status(500).json({ erro: "Falha ao listar regiões." });
  }
}

async function listarLugares(req, res) {
  const id_regiao = Number(req.params.id_regiao);
  if (!id_regiao) return res.status(400).json({ erro: "Região inválida." });

  try {
    const lugares = await mundoModel.listarLugaresPorRegiao(id_regiao);
    return res.json(lugares);
  } catch {
    return res.status(500).json({ erro: "Falha ao listar lugares." });
  }
}

async function listarNpcs(req, res) {
  const id_regiao = req.query.regiao ? Number(req.query.regiao) : null;
  const id_lugar = req.query.lugar ? Number(req.query.lugar) : null;

  try {
    const npcs = await mundoModel.listarNpcs({ id_regiao, id_lugar });
    return res.json(npcs);
  } catch {
    return res.status(500).json({ erro: "Falha ao listar NPCs." });
  }
}

async function listarDialogos(req, res) {
  const id_npc = Number(req.params.id_npc);
  if (!id_npc) return res.status(400).json({ erro: "NPC inválido." });

  try {
    const dialogos = await mundoModel.listarDialogosPorNpc(id_npc);
    return res.json(dialogos);
  } catch {
    return res.status(500).json({ erro: "Falha ao listar diálogos." });
  }
}

module.exports = {
  listarRegioes,
  listarLugares,
  listarNpcs,
  listarDialogos,
};

