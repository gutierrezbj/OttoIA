const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');
const { getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// ─── Passport Google Strategy ───────────────────────────────────
// Configured lazily on first request so app.locals.db is available

let strategyConfigured = false;

function ensureStrategy(req) {
  if (strategyConfigured) return;

  const db = req.app.locals.db;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const db = req.app.locals.db;
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const picture = profile.photos?.[0]?.value || null;

      // Find or create user
      let user = await db.collection('users').findOne({ email });

      if (user) {
        await db.collection('users').updateOne(
          { user_id: user.user_id },
          { $set: { name, picture, google_id: profile.id } }
        );
        user = await db.collection('users').findOne({ email });
      } else {
        const userId = `user_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
        user = {
          user_id: userId,
          email,
          name,
          picture,
          google_id: profile.id,
          created_at: new Date().toISOString()
        };
        await db.collection('users').insertOne(user);
      }

      // Create session token
      const sessionToken = `session_${uuidv4().replace(/-/g, '')}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.collection('user_sessions').deleteMany({ user_id: user.user_id });
      await db.collection('user_sessions').insertOne({
        user_id: user.user_id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      });

      user._sessionToken = sessionToken;
      done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  strategyConfigured = true;
}

// ─── Google OAuth Routes ────────────────────────────────────────

// Start Google login
router.get('/google', (req, res, next) => {
  ensureStrategy(req);
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

// Google callback
router.get('/google/callback', (req, res, next) => {
  ensureStrategy(req);
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      console.error('Auth callback error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}?auth_error=true`);
    }

    // Set session cookie
    res.cookie('session_token', user._sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?login=success`);
  })(req, res, next);
});

// ─── Session Exchange (legacy Emergent compatibility) ───────────

router.get('/session', async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ detail: 'session_id requerido' });
    }

    // Try Emergent auth if configured
    const axios = require('axios');
    const authResponse = await axios.get(
      'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
      { headers: { 'X-Session-ID': session_id } }
    );

    if (authResponse.status !== 200) {
      return res.status(401).json({ detail: 'Error de autenticación' });
    }

    const authData = authResponse.data;
    const db = req.app.locals.db;

    let userId = `user_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
    const existingUser = await db.collection('users').findOne({ email: authData.email });

    if (existingUser) {
      userId = existingUser.user_id;
      await db.collection('users').updateOne(
        { user_id: userId },
        { $set: { name: authData.name, picture: authData.picture || null } }
      );
    } else {
      await db.collection('users').insertOne({
        user_id: userId,
        email: authData.email,
        name: authData.name,
        picture: authData.picture || null,
        created_at: new Date().toISOString()
      });
    }

    const sessionToken = authData.session_token || `session_${uuidv4().replace(/-/g, '')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.collection('user_sessions').deleteMany({ user_id: userId });
    await db.collection('user_sessions').insertOne({
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    });

    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const user = await db.collection('users').findOne({ user_id: userId });
    res.json(user);
  } catch (error) {
    console.error('Session exchange error:', error);
    res.status(401).json({ detail: 'Error de autenticación' });
  }
});

// ─── Current User & Logout ──────────────────────────────────────

router.get('/me', getCurrentUser, (req, res) => {
  res.json(req.user);
});

router.post('/logout', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    const db = req.app.locals.db;

    if (sessionToken) {
      await db.collection('user_sessions').deleteMany({ session_token: sessionToken });
    }

    res.clearCookie('session_token', { path: '/' });
    res.json({ message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ detail: 'Error al cerrar sesión' });
  }
});

module.exports = router;
