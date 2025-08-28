const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

const usuariosController = require('../controllers/usuariosController');

/**
 * @openapi
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 */

/**
 * @openapi
 * /usuarios/me:
 *   get:
 *     summary: Retorna o perfil do usuário logado
 *     description: Retorna os dados do usuário autenticado.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 401
 *                 message: Não autorizado
 *       500:
 *         description: Falha ao obter perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao obter perfil
 */
router.get('/me', authenticateToken, usuariosController.getMe);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários registrados.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuários retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuários não encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 404
 *                 message: Usuários não encontrados
 *       500:
 *         description: Falha ao obter usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao obter usuários
 */
router.get('/', usuariosController.getUsuarios);

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     description: Retorna os detalhes de um usuário pelo seu ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 404
 *                 message: Usuário não encontrado
 *       500:
 *         description: Falha ao obter usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao obter usuário
 */
router.get('/:id', usuariosController.getUsuarioById);

/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     description: Deleta um usuário pelo seu ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 404
 *                 message: Usuário não encontrado
 *       500:
 *         description: Falha ao deletar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao deletar usuário
 */
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;
