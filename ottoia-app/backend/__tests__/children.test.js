const request = require('supertest');
const { createApp } = require('../app');
const { createMockDb, resetStore, seedTestUser, seedTestChild } = require('./setup');

describe('Children CRUD', () => {
  let app, db, token, user;

  beforeEach(() => {
    resetStore();
    db = createMockDb();
    app = createApp(db);
    ({ token, user } = seedTestUser(db));
  });

  describe('GET /api/children', () => {
    test('returns 401 without auth', async () => {
      const res = await request(app).get('/api/children');
      expect(res.status).toBe(401);
    });

    test('returns empty array when no children', async () => {
      const res = await request(app)
        .get('/api/children')
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('returns children for authenticated parent', async () => {
      seedTestChild(user.user_id);
      const res = await request(app)
        .get('/api/children')
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Maria');
    });
  });

  describe('POST /api/children', () => {
    test('creates a child with valid data', async () => {
      const res = await request(app)
        .post('/api/children')
        .set('Cookie', `session_token=${token}`)
        .send({ name: 'Carlos', age: 10, grade: 5 });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Carlos');
      expect(res.body.child_id).toBeDefined();
      expect(res.body.parent_id).toBe(user.user_id);
      expect(res.body.subjects).toEqual(['matematicas', 'lengua', 'ciencias', 'ingles']);
    });

    test('returns 400 without required fields', async () => {
      const res = await request(app)
        .post('/api/children')
        .set('Cookie', `session_token=${token}`)
        .send({ name: 'Carlos' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/children/:child_id', () => {
    test('returns specific child', async () => {
      const child = seedTestChild(user.user_id);
      const res = await request(app)
        .get(`/api/children/${child.child_id}`)
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Maria');
    });

    test('returns 404 for non-existent child', async () => {
      const res = await request(app)
        .get('/api/children/child_nonexistent')
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/children/:child_id', () => {
    test('deletes own child', async () => {
      const child = seedTestChild(user.user_id);
      const res = await request(app)
        .delete(`/api/children/${child.child_id}`)
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
    });
  });
});
