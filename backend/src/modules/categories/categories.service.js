const categoryModel = require('../../models/category.model');
const departmentModel = require('../../models/department.model');
const httpError = require('../../utils/httpError');

function list({ departmentId }) {
  return categoryModel.list({ departmentId });
}

async function create(data) {
  const department = await departmentModel.findById(data.department_id);
  if (!department) {
    throw httpError(422, 'Invalid department_id');
  }
  return categoryModel.create({
    name: data.name,
    department_id: data.department_id,
  });
}

async function update(id, data) {
  const category = await categoryModel.findById(id);
  if (!category) {
    throw httpError(404, 'Category not found');
  }
  return categoryModel.update(id, {
    name: data.name ?? category.name,
    is_active: data.is_active ?? category.is_active,
  });
}

async function remove(id) {
  const category = await categoryModel.findById(id);
  if (!category) {
    throw httpError(404, 'Category not found');
  }
  await categoryModel.softDelete(id);
}

module.exports = { list, create, update, remove };
