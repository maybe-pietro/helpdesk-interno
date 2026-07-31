exports.seed = async function seed(knex) {
  const requester = await knex('users').where({ email: 'solicitante@empresa.com' }).first();
  const agent = await knex('users').where({ email: 'agente.ti@empresa.com' }).first();
  const category = await knex('categories').where({ name: 'Acesso a sistema' }).first();

  if (!requester || !agent || !category) {
    return;
  }

  const [ticketId] = await knex('tickets').insert({
    title: 'Nao consigo acessar o sistema interno',
    description: 'Ao tentar logar recebo a mensagem "usuario ou senha invalidos", mas tenho certeza que estao corretos.',
    status: 'em_andamento',
    priority: 'alta',
    category_id: category.id,
    department_id: category.department_id,
    requester_id: requester.id,
    assigned_agent_id: agent.id,
  });

  await knex('ticket_events').insert([
    {
      ticket_id: ticketId,
      author_id: agent.id,
      event_type: 'status_change',
      old_status: 'aberto',
      new_status: 'em_andamento',
    },
    {
      ticket_id: ticketId,
      author_id: agent.id,
      event_type: 'comment',
      comment_body: 'Estamos verificando o cadastro do seu usuario, retornamos em breve.',
      is_internal: false,
    },
  ]);
};
