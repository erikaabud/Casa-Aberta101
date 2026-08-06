const classeModel = require("../models/classeModel");

async function listar(req, res) {
  try {
    const total = await classeModel.contarClasses();
    const autoSeed = (process.env.AUTO_SEED_CLASSES || "true") === "true";

    if (total === 0 && autoSeed) {
      await classeModel.inserirClassesPadrao();
    }

    const classes = await classeModel.listarClasses();
    return res.json(classes);
  } catch (erro) {
    return res.status(500).json({ erro: "Falha ao listar classes." });
  }
}

module.exports = { listar };

