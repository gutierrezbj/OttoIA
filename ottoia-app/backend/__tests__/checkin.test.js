const request = require('supertest');
const { createApp } = require('../app');
const { createMockDb, resetStore, seedTestUser, seedTestChild } = require('./setup');

describe('Check-in endpoints', () => {
  let app, db, token, user, child;

  beforeEach(() => {
    resetStore();
    db = createMockDb();
    app = createApp(db);
    ({ token, user } = seedTestUser(db));
    child = seedTestChild(user.user_id);
  });

  describe('POST /api/checkin/:child_id', () => {
    test('creates check-in with mood and energy', async () => {
      const res = await request(app)
        .post(`/api/checkin/${child.child_id}`)
        .set('Cookie', `session_token=${token}`)
        .send({ mood: 'happy', energy: 4 });
      expect(res.status).toBe(200);
      expect(res.body.mood).toBe('happy');
      expect(res.body.energy).toBe(4);
      expect(res.body.child_id).toBe(child.child_id);
    });

    test('returns 400 without required fields', async () => {
      const res = await request(app)
        .post(`/api/checkin/${child.child_id}`)
        .set('Cookie', `session_token=${token}`)
        .send({ mood: 'happy' });
      expect(res.status).toBe(400);
    });

    test('returns 401 without auth', async () => {
      const res = await request(app)
        .post(`/api/checkin/${child.child_id}`)
        .send({ mood: 'happy', energy: 4 });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/checkin/:child_id/today', () => {
    test('returns null when no check-in today', async () => {
      const res = await request(app)
        .get(`/api/checkin/${child.child_id}/today`)
        .set('Cookie', `session_token=${token}`);
      expect(res.status).toBe(200);
    });
  });
});
