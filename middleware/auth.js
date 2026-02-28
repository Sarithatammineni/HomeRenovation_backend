// backend/middleware/auth.js
// Validates the Supabase JWT sent from the frontend in: Authorization: Bearer <token>
const supabase = require('../lib/supabase');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = header.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
    }

    req.user = user; // { id, email, user_metadata }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ error: 'Internal auth error' });
  }
}

module.exports = { requireAuth };
