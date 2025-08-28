const usuariosRepository = require('../repositories/usuariosRepository');
const ApiError = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    const user = await usuariosRepository.findUserByEmail(email);

    if (!user) {
      return next(
        new ApiError('Usuario nao encontrado', 404, {
          email: 'usuario nao encontrado',
        })
      );
    }

    const issenhaValid = await bcrypt.compare(senha, user.senha);

    if (!issenhaValid) {
      return next(
        new ApiError('Senha invalida', 401, {
          senha: 'Senha invalida',
        })
      );
    }

    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      message: 'Login de usuário realizado com sucesso',
      acess_token: token,
    });
  } catch (error) {
    next(new ApiError('Erro ao fazer login', 500, error.message));
  }
};

const signUp = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    const user = await usuariosRepository.findUserByEmail(email);

    if (user) {
      return next(
        new ApiError('Usuario ja cadastrado', 400, {
          email: 'Email ja cadastrado',
        })
      );
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const hashedsenha = await bcrypt.hash(senha, salt);

    const newUser = await usuariosRepository.create({
      nome,
      email,
      senha: hashedsenha,
    });

    res.status(201).json({
      message: 'Usuario cadastrado com sucesso',
      user: newUser,
    });
  } catch (error) {
    next(new ApiError('Erro ao cadastrar o usuario', 500, error.message));
  }
};

const logOut = async (req, res, next) => {
  res.clearCookie('token', { path: '/' });
  try {
    res.status(200).json({
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    next(new ApiError('Erro ao fazer logout', 500, error.message));
  }
};

module.exports = {
  login,
  signUp,
  logOut,
};
