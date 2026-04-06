require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
let mongoClient;
let db;

async function connectMongoDB() {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'ottoia';

    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    db = mongoClient.db(dbName);

    console.log(`MongoDB connected to ${dbName}`);

    // Create indexes
    await db.collection('users').createIndex({ user_id: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('user_sessions').createIndex({ session_token: 1 }, { unique: true });
    await db.collection('user_sessions').createIndex({ user_id: 1 });
    await db.collection('children').createIndex({ child_id: 1 }, { unique: true });
    await db.collection('children').createIndex({ parent_id: 1 });
    await db.collection('exercises').createIndex({ exercise_id: 1 }, { unique: true });
    await db.collection('exercises').createIndex({ child_id: 1 });
    await db.collection('attempts').createIndex({ attempt_id: 1 }, { unique: true });
    await db.collection('attempts').createIndex({ child_id: 1 });
    await db.collection('skill_progress').createIndex({ child_id: 1, skill_id: 1 }, { unique: true });
    await db.collection('chat_messages').createIndex({ child_id: 1 });
    await db.collection('chat_messages').createIndex({ created_at: 1 });
    await db.collection('checkins').createIndex({ child_id: 1 });
    await db.collection('checkins').createIndex({ created_at: 1 });

    // Store db in app locals for route access
    app.locals.db = db;

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',');
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session + Passport (needed for Google OAuth flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'ottoia-dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'OttoAI API - Tu tutor personal de primaria' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ottoia-api' });
});

// Mount route modules
app.use('/api/auth', require('./routes/auth'));
app.use('/api/children', require('./routes/children'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/report', require('./routes/report'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`OttoIA API running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down gracefully...');
      if (mongoClient) {
        await mongoClient.close();
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
