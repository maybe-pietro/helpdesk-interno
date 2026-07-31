const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require('../../config/env');
const userModel = require('../../models/user.model');
const httpError = require('../../utils/httpError');

function toPublicUser(user) {
  const { password_hash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

async function login(email, password) {
  const user = await userModel.findByEmail(email);
  if (!user || !user.is_active) {
    throw httpError(401, 'Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw httpError(401, 'Invalid credentials');
  }

  return { token: signToken(user), user: toPublicUser(user) };
}

async function getMe(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw httpError(404, 'User not found');
  }
  return user;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userModel.findByIdWithPassword(userId);
  if (!user) {
    throw httpError(404, 'User not found');
  }

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    throw httpError(401, 'Current password is incorrect');
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await userModel.updatePasswordHash(userId, newHash);
}

module.exports = { login, getMe, changePassword };
