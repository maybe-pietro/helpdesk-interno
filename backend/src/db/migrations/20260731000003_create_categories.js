exports.up = function up(knex) {
  return knex.schema.createTable('categories', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 100).notNullable();
    table.integer('department_id').unsigned().notNullable()
      .references('id').inTable('departments').onDelete('CASCADE');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.unique(['department_id', 'name'], { indexName: 'uq_category_per_department' });
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('categories');
};
