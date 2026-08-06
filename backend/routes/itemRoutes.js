const express = require("express");
const { autenticar } = require("../middlewares/autenticacao");
const itemController = require("../controllers/itemController");

const router = express.Router();

router.get("/", itemController.listar);
router.get("/minha-equipe", autenticar, itemController.listarItensDaMinhaEquipe);

module.exports = router;

