const bcrypt = require('bcrypt');

const userModel = require('../../models/user.model');
const httpError = require('../../utils/httpError');

function list({ role, departmentId, search }) {
  return userModel.list({ role, departmentId, search });
}

async function getById(id) {
  const user = await userModel.findById(id);
  if (!user) {
    throw httpError(404, 'User not found');
  }
  return user;
}

async function create(data) {
  const existing = await userModel.findByEmail(data.email);
  if (existing) {
    throw httpError(422, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  return userModel.create({
    name: data.name,
    email: data.email,
    password_hash: passwordHash,
    role: data.role,
    department_id: data.department_id || null,
  });
}

async function update(id, data) {
  const user = await userModel.findById(id);
  if (!user) {
    throw httpError(404, 'User not found');
  }

  return userModel.update(id, {
    name: data.name ?? user.name,
    role: data.role ?? user.role,
    department_id: data.department_id !== undefined ? data.department_id : user.department_id,
    is_active: data.is_active ?? user.is_active,
  });
}

async function remove(id) {
  const user = await userModel.findById(id);
  if (!user) {
    throw httpError(404, 'User not found');
  }
  await userModel.softDelete(id);
}

module.exports = { list, getById, create, update, remove };
