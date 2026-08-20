const express = require("express");

const poderesController = require("../controllers/poderesController");
const { autenticar } = require("../middlewares/autenticacao");
const router = express.Router();


// Listar poderes
router.get("/", poderesController.listar);


// Consultar MP e estado da Chave de Cera
router.get(
  "/estado",
  autenticar,
  poderesController.estado
);


// Usar poder
router.post(
  "/usar",
  autenticar,
  poderesController.usar
);


module.exports = router;