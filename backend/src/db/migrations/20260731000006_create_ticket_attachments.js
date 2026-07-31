exports.up = function up(knex) {
  return knex.schema.createTable('ticket_attachments', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('ticket_id').unsigned().notNullable()
      .references('id').inTable('tickets').onDelete('CASCADE');
    table.integer('event_id').unsigned().nullable()
      .references('id').inTable('ticket_events').onDelete('SET NULL');
    table.integer('uploaded_by').unsigned().notNullable()
      .references('id').inTable('users');
    table.string('original_name', 255).notNullable();
    table.string('stored_filename', 255).notNullable();
    table.string('mime_type', 120).notNullable();
    table.integer('size_bytes').unsigned().notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('ticket_id', 'idx_attachments_ticket');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('ticket_attachments');
};
