exports.up = function up(knex) {
  return knex.schema.createTable('ticket_events', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('ticket_id').unsigned().notNullable()
      .references('id').inTable('tickets').onDelete('CASCADE');
    table.integer('author_id').unsigned().notNullable()
      .references('id').inTable('users');
    table.enu('event_type', ['comment', 'status_change', 'assignment_change']).notNullable();
    table.text('comment_body').nullable();
    table.string('old_status', 40).nullable();
    table.string('new_status', 40).nullable();
    table.integer('old_agent_id').unsigned().nullable()
      .references('id').inTable('users');
    table.integer('new_agent_id').unsigned().nullable()
      .references('id').inTable('users');
    table.boolean('is_internal').notNullable().defaultTo(false);
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['ticket_id', 'created_at'], 'idx_events_ticket');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('ticket_events');
};
