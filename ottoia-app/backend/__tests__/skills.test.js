const request = require('supertest');
const { createApp } = require('../app');
const { createMockDb, resetStore } = require('./setup');

describe('Skills endpoints (public)', () => {
  let app;

  beforeEach(() => {
    resetStore();
    app = createApp(createMockDb());
  });

  test('GET /api/skills returns skills without auth', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/skills?subject=matematicas filters by subject', async () => {
    const res = await request(app).get('/api/skills?subject=matematicas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
