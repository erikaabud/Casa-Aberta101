const express = require("express");
const classeController = require("../controllers/classeController");

const router = express.Router();

router.get("/", classeController.listar);

module.exports = router;

