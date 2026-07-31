const db = require('../config/db');

const TABLE = 'departments';

function list({ includeInactive = false } = {}) {
  const query = db(TABLE).select('*').orderBy('name');
  if (!includeInactive) {
    query.where({ is_active: true });
  }
  return query;
}

function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

function softDelete(id) {
  return db(TABLE).where({ id }).update({ is_active: false });
}

module.exports = { list, findById, create, update, softDelete };
