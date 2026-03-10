const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/authController");

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Gera um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/token", generateToken);

module.exports = router;