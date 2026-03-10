const { Pool } = require("pg");
require("dotenv").config();

// Pool de conexões com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Testa a conexão ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco de dados:", err.message);
  } else {
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
    release();
  }
});

module.exports = pool;
