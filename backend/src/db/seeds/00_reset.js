// Clears all seedable tables in FK-safe order so `npm run seed` can be run
// repeatedly during development without hitting foreign key violations.
exports.seed = async function seed(knex) {
  await knex('ticket_attachments').del();
  await knex('ticket_events').del();
  await knex('tickets').del();
  await knex('categories').del();
  await knex('users').del();
  await knex('departments').del();
};
