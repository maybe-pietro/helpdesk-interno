const db = require('../../config/db');

async function summary() {
  const rows = await db('tickets').select('status').count({ count: 'id' }).groupBy('status');
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);
  const open = total - (byStatus.fechado || 0);
  return { total, open, closed: byStatus.fechado || 0, byStatus };
}

async function byCategory() {
  const rows = await db('tickets')
    .join('categories', 'categories.id', 'tickets.category_id')
    .select('categories.name as category')
    .count({ count: 'tickets.id' })
    .groupBy('categories.id', 'categories.name')
    .orderBy('count', 'desc');
  return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
}

async function byDepartment() {
  const rows = await db('tickets')
    .join('departments', 'departments.id', 'tickets.department_id')
    .select('departments.name as department')
    .count({ count: 'tickets.id' })
    .groupBy('departments.id', 'departments.name')
    .orderBy('count', 'desc');
  return rows.map((r) => ({ department: r.department, count: Number(r.count) }));
}

async function avgResolutionTime({ departmentId } = {}) {
  const query = db('tickets')
    .whereNotNull('resolved_at')
    .select(db.raw('AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours'));
  if (departmentId) {
    query.where('department_id', departmentId);
  }
  const [{ avg_hours: avgHours }] = await query;
  return { avgHours: avgHours !== null ? Number(avgHours) : null };
}

module.exports = { summary, byCategory, byDepartment, avgResolutionTime };
