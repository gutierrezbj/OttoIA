// Shared test setup — mock DB collections
const { v4: uuidv4 } = require('uuid');

// In-memory data store
let store = {};

function resetStore() {
  store = {
    users: [],
    user_sessions: [],
    children: [],
    exercises: [],
    attempts: [],
    skill_progress: [],
    chat_messages: [],
    checkins: [],
  };
}

// Mock MongoDB collection
function mockCollection(name) {
  return {
    findOne: jest.fn(async (query) => {
      const items = store[name] || [];
      return items.find(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
      }) || null;
    }),
    find: jest.fn((query = {}) => {
      const items = store[name] || [];
      const filtered = items.filter(item => {
        return Object.keys(query).every(key => {
          if (typeof query[key] === 'object' && query[key].$gte) {
            return new Date(item[key]) >= new Date(query[key].$gte);
          }
          return item[key] === query[key];
        });
      });
      return {
        project: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn(async () => filtered),
      };
    }),
    insertOne: jest.fn(async (doc) => {
      if (!store[name]) store[name] = [];
      store[name].push(doc);
      return { insertedId: doc._id || 'mock-id' };
    }),
    updateOne: jest.fn(async (query, update) => {
      const items = store[name] || [];
      const idx = items.findIndex(item =>
        Object.keys(query).every(key => item[key] === query[key])
      );
      if (idx !== -1 && update.$set) {
        Object.assign(items[idx], update.$set);
      }
      if (idx !== -1 && update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) {
          items[idx][k] = (items[idx][k] || 0) + v;
        }
      }
      return { matchedCount: idx !== -1 ? 1 : 0 };
    }),
    deleteOne: jest.fn(async (query) => {
      const items = store[name] || [];
      const idx = items.findIndex(item =>
        Object.keys(query).every(key => item[key] === query[key])
      );
      if (idx !== -1) items.splice(idx, 1);
      return { deletedCount: idx !== -1 ? 1 : 0 };
    }),
    deleteMany: jest.fn(async () => ({ deletedCount: 0 })),
    countDocuments: jest.fn(async (query = {}) => {
      const items = store[name] || [];
      return items.filter(item =>
        Object.keys(query).every(key => {
          if (typeof query[key] === 'object' && query[key].$gte) {
            return new Date(item[key]) >= new Date(query[key].$gte);
          }
          return item[key] === query[key];
        })
      ).length;
    }),
    createIndex: jest.fn(async () => 'mock-index'),
  };
}

// Mock DB object
function createMockDb() {
  return {
    collection: jest.fn((name) => mockCollection(name)),
  };
}

// Seed a test user + session
function seedTestUser(db) {
  const userId = 'user_test123';
  const token = 'test-session-token';
  const user = {
    user_id: userId,
    email: 'test@example.com',
    name: 'Test User',
    picture: '',
    created_at: new Date().toISOString(),
  };
  const session = {
    session_token: token,
    user_id: userId,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    created_at: new Date().toISOString(),
  };

  store.users.push(user);
  store.user_sessions.push(session);

  return { user, token };
}

// Seed a test child
function seedTestChild(parentId) {
  const child = {
    child_id: 'child_test456',
    parent_id: parentId,
    name: 'Maria',
    age: 8,
    grade: 3,
    subjects: ['matematicas', 'lengua', 'ciencias', 'ingles'],
    created_at: new Date().toISOString(),
  };
  store.children.push(child);
  return child;
}

module.exports = {
  createMockDb,
  resetStore,
  seedTestUser,
  seedTestChild,
  store,
};
