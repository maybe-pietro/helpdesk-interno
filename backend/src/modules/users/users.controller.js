const usersService = require('./users.service');

async function list(req, res, next) {
  try {
    const { role, search } = req.query;
    const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
    res.json(await usersService.list({ role, departmentId, search }));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.json(await usersService.getById(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await usersService.create(req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await usersService.update(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await usersService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
