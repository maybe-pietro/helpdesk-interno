const ticketsService = require('./tickets.service');

function parseFilters(query) {
  return {
    status: query.status,
    priority: query.priority,
    categoryId: query.category_id ? Number(query.category_id) : undefined,
    departmentId: query.department_id ? Number(query.department_id) : undefined,
    assignedAgentId: query.assigned_agent_id === 'me' ? 'me' : (query.assigned_agent_id ? Number(query.assigned_agent_id) : undefined),
    search: query.search,
  };
}

async function list(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const page = req.query.page ? Number(req.query.page) : 1;
    const result = await ticketsService.list(req.user, filters, { page });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.json(await ticketsService.getById(req.user, Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await ticketsService.create(req.user, req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await ticketsService.update(req.user, Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

async function changeStatus(req, res, next) {
  try {
    res.json(await ticketsService.changeStatus(req.user, Number(req.params.id), req.body.status));
  } catch (err) {
    next(err);
  }
}

async function assign(req, res, next) {
  try {
    res.json(await ticketsService.assign(req.user, Number(req.params.id), req.body.agent_id));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, changeStatus, assign };
