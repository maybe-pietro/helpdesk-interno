const { app, request, loginAs, authed, getSeedCategoryId, closeDb } = require('./helpers');

afterAll(closeDb);

async function createTicket(token, overrides = {}) {
  const categoryId = await getSeedCategoryId(token); // "Acesso a sistema", department TI (seeded)
  const res = await request(app)
    .post('/api/tickets')
    .set(authed(token))
    .send({
      title: 'Ticket de teste',
      description: 'Descricao de teste',
      category_id: categoryId,
      priority: 'media',
      ...overrides,
    });
  expect(res.status).toBe(201);
  return res.body;
}

describe('tickets', () => {
  test('solicitante only sees their own tickets in the list', async () => {
    const solicToken = await loginAs('solicitante');
    const ticket = await createTicket(solicToken);

    const list = await request(app).get('/api/tickets').set(authed(solicToken));
    expect(list.status).toBe(200);
    expect(list.body.rows.every((t) => t.requester_id === ticket.requester_id)).toBe(true);
    expect(list.body.rows.some((t) => t.id === ticket.id)).toBe(true);
  });

  // Regression test: agents used to get 403 "Not allowed to view this
  // ticket" for any ticket in their own department that wasn't already
  // assigned to them, because req.user.department_id was missing.
  test('agent can view and self-assign an unassigned ticket in their department', async () => {
    const solicToken = await loginAs('solicitante');
    const agentToken = await loginAs('agenteTI');
    const ticket = await createTicket(solicToken);

    const view = await request(app).get(`/api/tickets/${ticket.id}`).set(authed(agentToken));
    expect(view.status).toBe(200);

    const meRes = await request(app).get('/api/auth/me').set(authed(agentToken));
    const agentId = meRes.body.id;

    const assign = await request(app)
      .patch(`/api/tickets/${ticket.id}/assign`)
      .set(authed(agentToken))
      .send({ agent_id: agentId });
    expect(assign.status).toBe(200);
    expect(assign.body.assigned_agent_id).toBe(agentId);
  });

  test('invalid status transition is rejected with 422', async () => {
    const solicToken = await loginAs('solicitante');
    const agentToken = await loginAs('agenteTI');
    const ticket = await createTicket(solicToken);

    const res = await request(app)
      .patch(`/api/tickets/${ticket.id}/status`)
      .set(authed(agentToken))
      .send({ status: 'fechado' }); // aberto -> fechado is not a valid direct transition
    expect(res.status).toBe(422);
  });

  test('solicitante cannot change ticket status', async () => {
    const solicToken = await loginAs('solicitante');
    const ticket = await createTicket(solicToken);

    const res = await request(app)
      .patch(`/api/tickets/${ticket.id}/status`)
      .set(authed(solicToken))
      .send({ status: 'em_andamento' });
    expect(res.status).toBe(403);
  });

  // Regression test: reopening a ticket used to leave resolved_at/closed_at
  // set from the previous cycle, inflating the dashboard's avg-resolution-time.
  test('reopening a resolved ticket clears resolved_at and closed_at', async () => {
    const solicToken = await loginAs('solicitante');
    const agentToken = await loginAs('agenteTI');
    const ticket = await createTicket(solicToken);

    await request(app).patch(`/api/tickets/${ticket.id}/status`).set(authed(agentToken)).send({ status: 'em_andamento' });
    const resolved = await request(app).patch(`/api/tickets/${ticket.id}/status`).set(authed(agentToken)).send({ status: 'resolvido' });
    expect(resolved.body.resolved_at).not.toBeNull();

    const reopened = await request(app).patch(`/api/tickets/${ticket.id}/status`).set(authed(agentToken)).send({ status: 'em_andamento' });
    expect(reopened.status).toBe(200);
    expect(reopened.body.resolved_at).toBeNull();
    expect(reopened.body.closed_at).toBeNull();
  });
});
