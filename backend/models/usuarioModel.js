const pool = require("../config/db");

async function criarUsuario({ nome_usuario, senha_hash }) {
  const [resultado] = await pool.execute(
    "INSERT INTO usuario(nome_usuario, senha_usuario) VALUES (?, ?)",
    [nome_usuario, senha_hash],
  );
  return resultado.insertId;
}

async function buscarUsuarioPorNome(nome_usuario) {
  const [linhas] = await pool.execute(
    "SELECT id_usuario, nome_usuario, senha_usuario FROM usuario WHERE nome_usuario = ?",
    [nome_usuario],
  );
  return linhas[0] || null;
}

async function buscarUsuarioPorId(id_usuario) {
  const [linhas] = await pool.execute(
    "SELECT id_usuario, nome_usuario FROM usuario WHERE id_usuario = ?",
    [id_usuario],
  );
  return linhas[0] || null;
}

module.exports = {
  criarUsuario,
  buscarUsuarioPorNome,
  buscarUsuarioPorId,
};
