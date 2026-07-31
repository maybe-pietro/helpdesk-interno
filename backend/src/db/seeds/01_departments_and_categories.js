const DEPARTMENTS = [
  {
    name: 'TI',
    description: 'Suporte tecnico e infraestrutura',
    categories: ['Acesso a sistema', 'Problema em equipamento', 'Instalacao de software'],
  },
  {
    name: 'RH',
    description: 'Recursos Humanos',
    categories: ['Ferias e beneficios', 'Documentos', 'Duvidas trabalhistas'],
  },
  {
    name: 'Financeiro',
    description: 'Financeiro e reembolsos',
    categories: ['Reembolso', 'Nota fiscal', 'Pagamento'],
  },
];

exports.seed = async function seed(knex) {
  for (const dept of DEPARTMENTS) {
    const [departmentId] = await knex('departments').insert({
      name: dept.name,
      description: dept.description,
      is_active: true,
    });

    await knex('categories').insert(
      dept.categories.map((name) => ({
        name,
        department_id: departmentId,
        is_active: true,
      })),
    );
  }
};
