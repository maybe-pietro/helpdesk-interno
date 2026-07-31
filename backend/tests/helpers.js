const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

const SEED_USERS = {
  admin: { email: 'admin@empresa.com', password: process.env.SEED_ADMIN_PASSWORD || 'admin123' },
  agenteTI: { email: 'agente.ti@empresa.com', password: 'agente123' },
  solicitante: { email: 'solicitante@empresa.com', password: 'solicitante123' },
};

async function loginAs(userKey) {
  const { email, password } = SEED_USERS[userKey];
  const res = await request(app).post('/api/auth/login').send({ email, password });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${userKey}: ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}

function authed(token) {
  return { Authorization: `Bearer ${token}` };
}

// IDs drift between runs (DELETE-based reseeding doesn't reset MySQL's
// auto-increment counters), so tests look categories up by name instead of
// hardcoding an id.
async function getSeedCategoryId(token, name = 'Acesso a sistema') {
  const res = await request(app).get('/api/categories').set(authed(token));
  const category = res.body.find((c) => c.name === name);
  if (!category) {
    throw new Error(`Seed category "${name}" not found`);
  }
  return category.id;
}

function closeDb() {
  return db.destroy();
}

module.exports = { app, request, SEED_USERS, loginAs, authed, getSeedCategoryId, closeDb };
