const migrationsAgentes = require('./20250810210628_create_agentes');
const migrationsCasos = require('./20250810213103_create_casos');
const migrationsUsuarios = require('./20250827212350_create_usuarios');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await migrationsAgentes.up(knex);
  await migrationsCasos.up(knex);
  await migrationsUsuarios.up(knex);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await migrationsCasos.down(knex);
  await migrationsAgentes.down(knex);
  await migrationsUsuarios.down(knex);
};
