const bcrypt = require('bcrypt');

const SEED_USERS = [
  {
    name: 'Administrador',
    email: 'admin@empresa.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    department: null,
  },
  {
    name: 'Agente TI',
    email: 'agente.ti@empresa.com',
    password: 'agente123',
    role: 'agente',
    department: 'TI',
  },
  {
    name: 'Solicitante Exemplo',
    email: 'solicitante@empresa.com',
    password: 'solicitante123',
    role: 'solicitante',
    department: null,
  },
];

exports.seed = async function seed(knex) {
  for (const user of SEED_USERS) {
    let departmentId = null;
    if (user.department) {
      const dept = await knex('departments').where({ name: user.department }).first();
      departmentId = dept ? dept.id : null;
    }

    await knex('users').insert({
      name: user.name,
      email: user.email,
      password_hash: await bcrypt.hash(user.password, 10),
      role: user.role,
      department_id: departmentId,
      is_active: true,
    });
  }
};
