exports.up = function up(knex) {
  return knex.schema.createTable('tickets', (table) => {
    table.increments('id').unsigned().primary();
    table.string('title', 150).notNullable();
    table.text('description').notNullable();
    table.enu('status', [
      'aberto',
      'em_andamento',
      'aguardando_solicitante',
      'resolvido',
      'fechado',
    ]).notNullable().defaultTo('aberto');
    table.enu('priority', ['baixa', 'media', 'alta', 'urgente']).notNullable().defaultTo('media');
    table.integer('category_id').unsigned().notNullable()
      .references('id').inTable('categories');
    table.integer('department_id').unsigned().notNullable()
      .references('id').inTable('departments');
    table.integer('requester_id').unsigned().notNullable()
      .references('id').inTable('users');
    table.integer('assigned_agent_id').unsigned().nullable()
      .references('id').inTable('users');
    table.datetime('resolved_at').nullable();
    table.datetime('closed_at').nullable();
    table.timestamps(true, true);

    table.index('status', 'idx_tickets_status');
    table.index('requester_id', 'idx_tickets_requester');
    table.index('assigned_agent_id', 'idx_tickets_agent');
    table.index('created_at', 'idx_tickets_created_at');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('tickets');
};
