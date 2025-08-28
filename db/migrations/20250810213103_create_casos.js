/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  //DROP TABLE IF EXISTS casos;
  await knex.schema.dropTableIfExists('casos');
  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.string('descricao').notNullable();
    table.enum('status', ['aberto', 'solucionado']).notNullable();
    table
      .integer('agente_id')
      .references('id')
      .inTable('agentes')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('casos');
};
