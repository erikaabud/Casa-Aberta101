const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post(
    "/",
    authController.cadastrar
);

router.post(
  "/login",
  authController.login,
);

module.exports = router;
