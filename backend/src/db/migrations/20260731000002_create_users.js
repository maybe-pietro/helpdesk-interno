exports.up = function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 120).notNullable();
    table.string('email', 190).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enu('role', ['solicitante', 'agente', 'admin']).notNullable().defaultTo('solicitante');
    table.integer('department_id').unsigned().nullable()
      .references('id').inTable('departments').onDelete('SET NULL');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('users');
};
