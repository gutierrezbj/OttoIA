// Express app factory for testing and production
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

function createApp(db) {
  const app = express();

  // Store db in app locals
  app.locals.db = db;

  // CORS
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

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'test-secret',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.get('/', (req, res) => {
    res.json({ message: 'OttoIA API - Tu tutor personal de primaria' });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ottoia-api' });
  });

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/children', require('./routes/children'));
  app.use('/api/skills', require('./routes/skills'));
  app.use('/api/exercises', require('./routes/exercises'));
  app.use('/api/attempts', require('./routes/attempts'));
  app.use('/api/chat', require('./routes/chat'));
  app.use('/api/checkin', require('./routes/checkin'));
  app.use('/api/progress', require('./routes/progress'));
  app.use('/api/report', require('./routes/report'));

  // Error handling
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ detail: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
