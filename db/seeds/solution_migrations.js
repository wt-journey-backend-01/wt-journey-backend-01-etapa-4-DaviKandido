const seedAgentes = require('./agentes.js');
const seedCasos = require('./casos.js');
const seedUsuarios = require('./usuarios.js');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await seedAgentes.seed(knex);
  await seedCasos.seed(knex);
  await seedUsuarios.seed(knex);
};
