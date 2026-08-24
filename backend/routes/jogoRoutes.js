const express = require("express");
const { autenticar } = require("../middlewares/autenticacao");
const jogoController = require("../controllers/jogoController");

const router = express.Router();

router.get("/ficha", autenticar, jogoController.obterMinhaFicha);
router.post("/coletar-item", autenticar, jogoController.coletarItem);

module.exports = router;
