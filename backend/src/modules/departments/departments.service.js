const departmentModel = require('../../models/department.model');
const httpError = require('../../utils/httpError');

function list() {
  return departmentModel.list();
}

async function create(data) {
  return departmentModel.create({
    name: data.name,
    description: data.description || null,
  });
}

async function update(id, data) {
  const department = await departmentModel.findById(id);
  if (!department) {
    throw httpError(404, 'Department not found');
  }
  return departmentModel.update(id, {
    name: data.name ?? department.name,
    description: data.description ?? department.description,
    is_active: data.is_active ?? department.is_active,
  });
}

async function remove(id) {
  const department = await departmentModel.findById(id);
  if (!department) {
    throw httpError(404, 'Department not found');
  }
  await departmentModel.softDelete(id);
}

module.exports = { list, create, update, remove };
