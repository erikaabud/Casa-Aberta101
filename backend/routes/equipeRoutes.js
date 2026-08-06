const express = require("express");
const { autenticar } = require("../middlewares/autenticacao");
const equipeController = require("../controllers/equipeController");

const router = express.Router();

router.get("/minha", autenticar, equipeController.minha);
router.post("/", autenticar, equipeController.criar);
router.post("/entrar", autenticar, equipeController.entrar);

module.exports = router;

