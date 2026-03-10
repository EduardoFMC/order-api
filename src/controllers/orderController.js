const pool = require("../config/database");

function mapOrderToDb(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

async function createOrder(req, res) {
  const client = await pool.connect();

  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items || !items.length) {
      return res.status(400).json({ error: "Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items." });
    }

    const order = mapOrderToDb(req.body);

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO "Order" ("orderId", "value", "creationDate") VALUES ($1, $2, $3)`,
      [order.orderId, order.value, order.creationDate]
    );

    for (const item of order.items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
        [order.orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({ message: "Pedido criado com sucesso!", order });
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return res.status(409).json({ error: "Pedido com este número já existe." });
    }

    console.error("Erro ao criar pedido:", err.message);
    return res.status(500).json({ error: "Erro interno ao criar pedido." });
  } finally {
    client.release();
  }
}

async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(
      `SELECT * FROM "Order" WHERE "orderId" = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    const itemsResult = await pool.query(
      `SELECT "productId", "quantity", "price" FROM "Items" WHERE "orderId" = $1`,
      [orderId]
    );

    return res.status(200).json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    console.error("Erro ao buscar pedido:", err.message);
    return res.status(500).json({ error: "Erro interno ao buscar pedido." });
  }
}

async function listOrders(req, res) {
  try {
    const ordersResult = await pool.query(`SELECT * FROM "Order" ORDER BY "creationDate" DESC`);

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT "productId", "quantity", "price" FROM "Items" WHERE "orderId" = $1`,
          [order.orderId]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Erro ao listar pedidos:", err.message);
    return res.status(500).json({ error: "Erro interno ao listar pedidos." });
  }
}

async function updateOrder(req, res) {
  const client = await pool.connect();

  try {
    const { orderId } = req.params;
    const { valorTotal, dataCriacao, items } = req.body;

    if (!valorTotal || !dataCriacao || !items || !items.length) {
      return res.status(400).json({ error: "Campos obrigatórios: valorTotal, dataCriacao, items." });
    }

    const exists = await client.query(`SELECT 1 FROM "Order" WHERE "orderId" = $1`, [orderId]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    const order = mapOrderToDb({ numeroPedido: orderId, valorTotal, dataCriacao, items });

    await client.query("BEGIN");

    await client.query(
      `UPDATE "Order" SET "value" = $1, "creationDate" = $2 WHERE "orderId" = $3`,
      [order.value, order.creationDate, orderId]
    );

    await client.query(`DELETE FROM "Items" WHERE "orderId" = $1`, [orderId]);

    for (const item of order.items) {
      await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({ message: "Pedido atualizado com sucesso!", order });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar pedido:", err.message);
    return res.status(500).json({ error: "Erro interno ao atualizar pedido." });
  } finally {
    client.release();
  }
}

async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `DELETE FROM "Order" WHERE "orderId" = $1 RETURNING *`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    return res.status(200).json({ message: "Pedido deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar pedido:", err.message);
    return res.status(500).json({ error: "Erro interno ao deletar pedido." });
  }
}

module.exports = { createOrder, getOrderById, listOrders, updateOrder, deleteOrder };