const departmentsService = require('./departments.service');

async function list(req, res, next) {
  try {
    res.json(await departmentsService.list());
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await departmentsService.create(req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await departmentsService.update(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await departmentsService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
