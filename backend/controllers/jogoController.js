const jogoModel = require("../models/jogoModel");

async function obterMinhaFicha(req, res) {
  const idUsuario = req.usuario?.id_usuario;

  try {
    const ficha = await jogoModel.obterFichaDoJogador(idUsuario);
    return res.json(ficha);
  } catch (erro) {
    console.error("[jogoController] erro ao obter ficha:", erro);
    return res
      .status(erro.status || 500)
      .json({ erro: erro.message || "Falha ao carregar a ficha do jogador." });
  }
}

async function coletarItem(req, res) {
  const idUsuario = req.usuario?.id_usuario;
  const idItem = Number(req.body?.id_item);
  const marcador = String(req.body?.marcador || "hiro");

  if (!idItem) {
    return res.status(400).json({ erro: "Informe o item que deve ser coletado." });
  }

  try {
    const resultado = await jogoModel.coletarItemPorMarcador({
      idUsuario,
      idItem,
      marcador,
    });

    return res.json(resultado);
  } catch (erro) {
    console.error("[jogoController] erro ao coletar item:", erro);
    return res
      .status(erro.status || 500)
      .json({ erro: erro.message || "Falha ao coletar o item." });
  }
}

module.exports = {
  obterMinhaFicha,
  coletarItem,
};
