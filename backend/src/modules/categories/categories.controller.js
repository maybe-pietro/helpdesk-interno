const categoriesService = require('./categories.service');

async function list(req, res, next) {
  try {
    const departmentId = req.query.department_id ? Number(req.query.department_id) : undefined;
    res.json(await categoriesService.list({ departmentId }));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await categoriesService.create(req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await categoriesService.update(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await categoriesService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
