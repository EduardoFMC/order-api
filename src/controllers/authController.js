const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "username e password são obrigatórios." });
  }

  if (username !== "admin" || password !== "admin123") {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(200).json({ token, expiresIn: process.env.JWT_EXPIRES_IN });
}

module.exports = { generateToken };