const path = require('path');
const knex = require('knex');
require('dotenv').config();

// Runs once before the whole test suite. Ensures the (existing) dev database
// has the latest migrations and a known, deterministic seed state — reusing
// the same seed scripts used for local dev (00_reset.js clears tables in
// FK-safe order before reseeding), so tests always start from a clean slate.
module.exports = async function globalSetup() {
  const db = knex({
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT || 3306),
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    },
    migrations: { directory: path.join(__dirname, '../src/db/migrations') },
    seeds: { directory: path.join(__dirname, '../src/db/seeds') },
  });

  await db.migrate.latest();
  await db.seed.run();
  await db.destroy();
};
