const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

function validarCredenciais(req, res) {
  const nome_usuario = String(req.body?.nome_usuario || "").trim();
  const senha_usuario = String(req.body?.senha_usuario || "");

  if (!nome_usuario) {
    res.status(400).json({ erro: "Nome de usuário é obrigatório." });
    return null;
  }

  if (senha_usuario.length < 3) {
    res.status(400).json({ erro: "Senha deve ter pelo menos 3 caracteres." });
    return null;
  }

  return { nome_usuario, senha_usuario };
}

async function cadastrar(req, res) {
  const credenciais = validarCredenciais(req, res);
  if (!credenciais) return;

  const { nome_usuario, senha_usuario } = credenciais;

  const existente = await usuarioModel.buscarUsuarioPorNome(nome_usuario);
  if (existente) {
    return res.status(409).json({ erro: "Usuário já existe." });
  }

  const senha_hash = await bcrypt.hash(senha_usuario, 10);
  const id_usuario = await usuarioModel.criarUsuario({ nome_usuario, senha_hash });

  return res.status(201).json({
    mensagem: "Usuário criado com sucesso.",
    usuario: { id_usuario, nome_usuario },
  });
}

async function login(req, res) {
  const credenciais = validarCredenciais(req, res);
  if (!credenciais) return;

  const { nome_usuario, senha_usuario } = credenciais;

  const usuario = await usuarioModel.buscarUsuarioPorNome(nome_usuario);
  if (!usuario) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  const senhaOk = await bcrypt.compare(senha_usuario, usuario.senha_usuario);
  if (!senhaOk) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, nome_usuario: usuario.nome_usuario },
    process.env.JWT_SECRET || "umbraeth_dev_secret",
    { expiresIn: "7d" },
  );

  return res.json({
    token,
    usuario: { id_usuario: usuario.id_usuario, nome_usuario: usuario.nome_usuario },
  });
}

module.exports = { cadastrar, login };

