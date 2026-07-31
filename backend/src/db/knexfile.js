require('dotenv').config();
const env = require('../config/env');

module.exports = {
  client: 'mysql2',
  connection: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};
