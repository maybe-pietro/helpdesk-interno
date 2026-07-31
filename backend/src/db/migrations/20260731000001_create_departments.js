exports.up = function up(knex) {
  return knex.schema.createTable('departments', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 100).notNullable().unique();
    table.string('description', 255).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('departments');
};
