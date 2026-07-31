require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim()),

  db: {
    host: required('MYSQL_HOST', 'localhost'),
    port: Number(process.env.MYSQL_PORT || 3306),
    database: required('MYSQL_DATABASE'),
    user: required('MYSQL_USER'),
    password: required('MYSQL_PASSWORD'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  uploads: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 1025),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'Helpdesk <no-reply@empresa.com>',
    enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
  },
};
