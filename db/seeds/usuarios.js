/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del();
  await knex('usuarios').insert([
    {
      nome: 'Alice Souza',
      email: 'alice@example.com',
      senha: 'hashed_senha_1',
    },
    {
      nome: 'Bruno Lima',
      email: 'bruno@example.com',
      senha: 'hashed_senha_2',
    },
    {
      nome: 'Carla Mendes',
      email: 'carla@example.com',
      senha: 'hashed_senha_3',
    },
  ]);
};
