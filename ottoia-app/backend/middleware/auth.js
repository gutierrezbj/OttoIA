// Auth middleware to get current user from cookie/header
async function getCurrentUser(req, res, next) {
  try {
    let sessionToken = req.cookies.session_token;

    // If no cookie, try Authorization header
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionToken = authHeader.split(' ')[1];
      }
    }

    if (!sessionToken) {
      return res.status(401).json({ detail: 'No autenticado' });
    }

    // Get database from app
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ detail: 'Database not initialized' });
    }

    // Find session
    const session = await db.collection('user_sessions').findOne({ session_token: sessionToken });
    if (!session) {
      return res.status(401).json({ detail: 'Sesión inválida' });
    }

    // Check expiration
    let expiresAt = session.expires_at;
    if (typeof expiresAt === 'string') {
      expiresAt = new Date(expiresAt);
    }
    if (expiresAt < new Date()) {
      return res.status(401).json({ detail: 'Sesión expirada' });
    }

    // Find user
    const user = await db.collection('users').findOne({ user_id: session.user_id });
    if (!user) {
      return res.status(401).json({ detail: 'Usuario no encontrado' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ detail: 'Error de autenticación' });
  }
}

module.exports = { getCurrentUser };
