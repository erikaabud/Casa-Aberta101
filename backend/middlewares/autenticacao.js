const jwt = require("jsonwebtoken");

function extrairToken(req) {
  const cabecalho = req.headers.authorization || "";
  const [tipo, token] = cabecalho.split(" ");
  if (tipo === "Bearer" && token) return token;
  return null;
}

function autenticar(req, res, next) {
  const token = extrairToken(req);

  if (!token) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "umbraeth_dev_secret");
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = { autenticar };

