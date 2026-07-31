const db = require('../config/db');

const TABLE = 'tickets';

const LIST_COLUMNS = [
  'tickets.id',
  'tickets.title',
  'tickets.status',
  'tickets.priority',
  'tickets.category_id',
  'tickets.department_id',
  'tickets.requester_id',
  'tickets.assigned_agent_id',
  'tickets.resolved_at',
  'tickets.closed_at',
  'tickets.created_at',
  'tickets.updated_at',
  'categories.name as category_name',
  'departments.name as department_name',
  'requester.name as requester_name',
  'agent.name as assigned_agent_name',
];

function baseQuery() {
  return db(TABLE)
    .join('categories', 'categories.id', 'tickets.category_id')
    .join('departments', 'departments.id', 'tickets.department_id')
    .join('users as requester', 'requester.id', 'tickets.requester_id')
    .leftJoin('users as agent', 'agent.id', 'tickets.assigned_agent_id');
}

function applyFilters(query, filters) {
  const {
    status,
    priority,
    categoryId,
    departmentId,
    assignedAgentId,
    requesterId,
    search,
  } = filters;

  if (status) query.where('tickets.status', status);
  if (priority) query.where('tickets.priority', priority);
  if (categoryId) query.where('tickets.category_id', categoryId);
  if (departmentId) query.where('tickets.department_id', departmentId);
  if (assignedAgentId) query.where('tickets.assigned_agent_id', assignedAgentId);
  if (requesterId) query.where('tickets.requester_id', requesterId);
  if (search) {
    query.where((builder) => {
      builder.where('tickets.title', 'like', `%${search}%`).orWhere('tickets.description', 'like', `%${search}%`);
    });
  }
}

async function list(filters = {}, { page = 1, pageSize = 20 } = {}) {
  const query = baseQuery().select(LIST_COLUMNS).orderBy('tickets.created_at', 'desc');
  applyFilters(query, filters);

  const countQuery = baseQuery().count({ count: 'tickets.id' });
  applyFilters(countQuery, filters);

  const [rows, [{ count }]] = await Promise.all([
    query.limit(pageSize).offset((page - 1) * pageSize),
    countQuery,
  ]);

  return { rows, total: Number(count), page, pageSize };
}

function findById(id) {
  return baseQuery().select(LIST_COLUMNS).where('tickets.id', id).first();
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

module.exports = { list, findById, create, update };
