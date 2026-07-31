const db = require('../config/db');

const TABLE = 'ticket_events';

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return db(TABLE).where({ id }).first();
}

function listByTicket(ticketId, { includeInternal = true } = {}) {
  const query = db(TABLE)
    .join('users as author', 'author.id', `${TABLE}.author_id`)
    .select(
      `${TABLE}.*`,
      'author.name as author_name',
    )
    .where(`${TABLE}.ticket_id`, ticketId)
    .orderBy(`${TABLE}.created_at`, 'asc');

  if (!includeInternal) {
    query.where(`${TABLE}.is_internal`, false);
  }

  return query;
}

module.exports = { create, listByTicket };
