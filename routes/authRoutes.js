const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSchema } = require('../utils/validateSchemas');
const { loginSchema, signUpSchema } = require('../utils/ZodSchemas');

/**
 * @openapi
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *     SignUp:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login de usuário
 *     description: Realiza o login de um usuário e retorna um access_token de autenticação.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           examples:
 *             LoginExemplo:
 *               value:
 *                 email: teste@exemplo.com
 *                 senha: senha@123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               Success:
 *                 value:
 *                   message: Login realizado com sucesso
 *                   access_token: abc123def456
 *       400:
 *         description: Dados incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 400
 *                 message: Parâmetros inválidos
 *                 errors:
 *                   - email: Campo obrigatório
 *                   - senha: Campo obrigatório
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 401
 *                 message: Email ou senha incorretos
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao realizar login
 */
router.post('/login', validateSchema(loginSchema), authController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro de usuário
 *     description: Cria um novo usuário no sistema.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUp'
 *           examples:
 *             SignUpExemplo:
 *               value:
 *                 nome: João Silva
 *                 email: joao@exemplo.com
 *                 senha: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               Success:
 *                 value:
 *                   access_token: abc123def456
 *                   message: Usuário criado com sucesso
 *       400:
 *         description: Dados incorretos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 400
 *                 message: Parâmetros inválidos
 *                 errors:
 *                   - nome: Campo obrigatório
 *                   - email: Campo obrigatório
 *                   - senha: Campo obrigatório
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao criar usuário
 */
router.post('/register', validateSchema(signUpSchema), authController.signUp);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout do usuário
 *     description: Realiza o logout do usuário e invalida o access_token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Logout realizado com sucesso
 *       401:
 *         description: access_token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 401
 *                 message: Não autorizado
 *       500:
 *         description: Erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: 500
 *                 message: Falha ao realizar logout
 */
router.post('/logout', authController.logOut);

module.exports = router;
