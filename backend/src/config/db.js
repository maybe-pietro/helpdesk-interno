const knex = require('knex');
const env = require('./env');

const db = knex({
  client: 'mysql2',
  connection: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,
  },
  pool: { min: 0, max: 10 },
});

module.exports = db;
