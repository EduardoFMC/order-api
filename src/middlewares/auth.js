const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware de autenticação JWT.
 * Verifica se o token enviado no header Authorization é válido.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Verifica se o header foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // Formato esperado: "Bearer <token>"
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido. Use: Bearer <token>" });
  }

  try {
    // Valida e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = authMiddleware;
