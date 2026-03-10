const pool = require("./database");

async function createTables() {
  const createOrderTable = `
    CREATE TABLE IF NOT EXISTS "Order" (
      "orderId"     VARCHAR(100) PRIMARY KEY,
      "value"       NUMERIC(10, 2) NOT NULL,
      "creationDate" TIMESTAMP NOT NULL
    );
  `;

  const createItemsTable = `
    CREATE TABLE IF NOT EXISTS "Items" (
      id          SERIAL PRIMARY KEY,
      "orderId"   VARCHAR(100) NOT NULL REFERENCES "Order"("orderId") ON DELETE CASCADE,
      "productId" INTEGER NOT NULL,
      "quantity"  INTEGER NOT NULL,
      "price"     NUMERIC(10, 2) NOT NULL
    );
  `;

  try {
    await pool.query(createOrderTable);
    await pool.query(createItemsTable);
    console.log("✅ Tabelas criadas/verificadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err.message);
    process.exit(1);
  }
}

module.exports = createTables;
