const usuariosRepository = require('../repositories/usuariosRepository');
const ApiError = require('../utils/errorHandler');

const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuariosRepository.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    next(new ApiError('Erro ao obter os usuarios', 500, error.message));
  }
};

const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await usuariosRepository.findById(id);
    res.status(200).json(usuario);
  } catch (error) {
    next(new ApiError('Erro ao obter o usuario', 500, error.message));
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new ApiError('Usuário não encontrado', 404, {
          user: 'Usuário não encontrado',
        })
      );
    }

    res.status(200).json(user);
  } catch (error) {
    next(new ApiError('Erro ao obter o usuario', 500, error.message));
  }
};

const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUsuario = await usuariosRepository.remove(id);
    res.status(200).json({
      message: 'Usuario excluido com sucesso',
      deletedUsuario,
    });
  } catch (error) {
    next(new ApiError('Erro ao excluir o usuario', 500, error.message));
  }
};

module.exports = {
  getUsuarios,
  getProfile,
  getUsuarioById,
  deleteUsuario,
};
