const db = require('../db/db');

const findAll = async () => await db('usuarios').select('*');

const findById = async (id) => await db('usuarios').where({ id }).first();

const findUserByEmail = async (email) => await db('usuarios').where({ email }).first();

const create = async (usuario) => {
  const [newUsuario] = await db.insert(usuario).into('usuarios').returning('*');
  return newUsuario;
};

const update = async (id, usuario) => {
  const usuarioDB = await db('usuarios').where({ id }).first();
  if (!usuarioDB) {
    return null;
  }
  const updatedUsuario = await db('usuarios').update(usuario).where({ id: id }).returning('*');
  return updatedUsuario[0];
};

const updatePartial = async (id, usuario) => {
  const usuarioDB = await db('usuarios').where({ id }).first();
  if (!usuarioDB) {
    return null;
  }
  const updateUsuario = { ...usuarioDB, ...usuario };
  const updatedUsuario = await db('usuarios')
    .update(updateUsuario)
    .where({ id: id })
    .returning('*');
  return updatedUsuario[0];
};

const remove = async (id) => {
  const usuarioDB = await db('usuarios').where({ id }).first();
  if (!usuarioDB) {
    return null;
  }
  await db('usuarios').where({ id }).del();
  return usuarioDB;
};

module.exports = {
  findAll,
  findById,
  findUserByEmail,
  create,
  update,
  updatePartial,
  remove,
};
