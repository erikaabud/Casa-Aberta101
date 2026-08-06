const express = require("express");
const mundoController = require("../controllers/mundoController");

const router = express.Router();

router.get("/regioes", mundoController.listarRegioes);
router.get("/regioes/:id_regiao/lugares", mundoController.listarLugares);
router.get("/npcs", mundoController.listarNpcs);
router.get("/npcs/:id_npc/dialogos", mundoController.listarDialogos);

module.exports = router;

