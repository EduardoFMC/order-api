const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createOrder, getOrderById, listOrders, updateOrder, deleteOrder } = require("../controllers/orderController");

router.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemInput:
 *       type: object
 *       properties:
 *         idItem:
 *           type: string
 *           example: "2434"
 *         quantidadeItem:
 *           type: integer
 *           example: 1
 *         valorItem:
 *           type: number
 *           example: 1000
 *     OrderInput:
 *       type: object
 *       required: [numeroPedido, valorTotal, dataCriacao, items]
 *       properties:
 *         numeroPedido:
 *           type: string
 *           example: "v10089015vdb-01"
 *         valorTotal:
 *           type: number
 *           example: 10000
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           example: "2023-07-19T12:24:11.529Z"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Pedido já existe
 */
router.post("/", createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/list", listOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:orderId", getOrderById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       404:
 *         description: Pedido não encontrado
 */
router.put("/:orderId", updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido deletado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:orderId", deleteOrder);

module.exports = router;