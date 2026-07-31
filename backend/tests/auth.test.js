const { app, request, loginAs, authed, SEED_USERS, closeDb } = require('./helpers');

afterAll(closeDb);

describe('auth', () => {
  test('login with valid credentials returns a token and user', async () => {
    const res = await request(app).post('/api/auth/login').send(SEED_USERS.admin);
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe(SEED_USERS.admin.email);
  });

  test('login with wrong password is rejected', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: SEED_USERS.admin.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  test('protected route rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('protected route rejects an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set(authed('not-a-real-token'));
    expect(res.status).toBe(401);
  });

  // Regression test: auth.middleware.js used to only put {id, role} on
  // req.user from the JWT payload, without department_id — this silently
  // broke every department-scoped permission check for agents.
  test('/me includes department_id for an agent', async () => {
    const token = await loginAs('agenteTI');
    const res = await request(app).get('/api/auth/me').set(authed(token));
    expect(res.status).toBe(200);
    expect(res.body.department_id).not.toBeNull();
  });

  // Regression test: deactivating a user used to leave their existing JWT
  // valid until natural expiry. auth.middleware.js now re-checks is_active
  // against the DB on every request.
  test('deactivating a user immediately revokes their existing token', async () => {
    const adminToken = await loginAs('admin');

    const created = await request(app)
      .post('/api/users')
      .set(authed(adminToken))
      .send({
        name: 'Auth Test User',
        email: `auth-test-${Date.now()}@empresa.com`,
        password: 'temp12345',
        role: 'solicitante',
      });
    expect(created.status).toBe(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: created.body.email, password: 'temp12345' });
    expect(login.status).toBe(200);
    const userToken = login.body.token;

    const meBeforeDeactivation = await request(app).get('/api/auth/me').set(authed(userToken));
    expect(meBeforeDeactivation.status).toBe(200);

    await request(app)
      .patch(`/api/users/${created.body.id}`)
      .set(authed(adminToken))
      .send({ is_active: false });

    const meAfterDeactivation = await request(app).get('/api/auth/me').set(authed(userToken));
    expect(meAfterDeactivation.status).toBe(401);
  });
});
