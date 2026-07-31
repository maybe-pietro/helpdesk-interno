const db = require('../config/db');

const TABLE = 'ticket_attachments';

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

function findById(id) {
  return db(TABLE).where({ id }).first();
}

function listByTicket(ticketId) {
  return db(TABLE).where({ ticket_id: ticketId }).orderBy('created_at', 'asc');
}

function remove(id) {
  return db(TABLE).where({ id }).del();
}

module.exports = { create, findById, listByTicket, remove };
