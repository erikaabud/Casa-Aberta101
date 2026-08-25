const classeModel = require("../models/classeModel");
const { garantirDadosBase } = require("../config/seedData");

async function listar(req, res) {
  try {
    const total = await classeModel.contarClasses();
    if (total === 0) {
      await garantirDadosBase();
    }

    const classes = await classeModel.listarClasses();
    return res.json(classes);
  } catch (erro) {
    return res.status(500).json({ erro: "Falha ao listar classes." });
  }
}

module.exports = { listar };

