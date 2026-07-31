const db = require('../config/db');

const TABLE = 'users';

const PUBLIC_COLUMNS = [
  'id',
  'name',
  'email',
  'role',
  'department_id',
  'is_active',
  'created_at',
  'updated_at',
];

function findByEmail(email) {
  return db(TABLE).where({ email }).first();
}

function findById(id) {
  return db(TABLE).where({ id }).select(PUBLIC_COLUMNS).first();
}

function findByIdWithPassword(id) {
  return db(TABLE).where({ id }).first();
}

async function updatePasswordHash(id, passwordHash) {
  await db(TABLE).where({ id }).update({ password_hash: passwordHash });
}

function list({ role, departmentId, search } = {}) {
  const query = db(TABLE).select(PUBLIC_COLUMNS).orderBy('name');
  if (role) {
    query.where({ role });
  }
  if (departmentId) {
    query.where({ department_id: departmentId });
  }
  if (search) {
    // MySQL's default collation is case-insensitive, so plain LIKE covers this.
    query.where((builder) => {
      builder.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`);
    });
  }
  return query;
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

module.exports = {
  PUBLIC_COLUMNS,
  findByEmail,
  findById,
  findByIdWithPassword,
  updatePasswordHash,
  list,
  create,
  update,
  softDelete,
};
