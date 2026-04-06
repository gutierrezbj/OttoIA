const request = require('supertest');
const { createApp } = require('../app');
const { createMockDb, resetStore, seedTestUser } = require('./setup');

describe('Auth endpoints', () => {
  let app, db;

  beforeEach(() => {
    resetStore();
    db = createMockDb();
    app = createApp(db);
  });

  describe('GET /api/auth/me', () => {
    test('returns 401 without session token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.detail).toBeDefined();
    });

    test('returns user with valid cookie', async () => {
      const { token, user } = seedTestUser(db);
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user_id).toBe(user.user_id);
      expect(res.body.email).toBe('test@example.com');
    });

    test('returns user with Bearer token', async () => {
      const { token, user } = seedTestUser(db);
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user_id).toBe(user.user_id);
    });

    test('returns 401 with invalid token', async () => {
      seedTestUser(db);
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'session_token=bad-token');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('returns 200 even without auth (clears cookie regardless)', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });

    test('clears session with valid cookie', async () => {
      const { token } = seedTestUser(db);
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });
  });
});
