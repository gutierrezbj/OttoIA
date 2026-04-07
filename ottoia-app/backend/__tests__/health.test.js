const request = require('supertest');
const { createApp } = require('../app');
const { createMockDb } = require('./setup');

describe('Health & Root endpoints', () => {
  let app;

  beforeAll(() => {
    app = createApp(createMockDb());
  });

  test('GET / returns API welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('OttoIA');
  });

  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'ottoia-api' });
  });
});
