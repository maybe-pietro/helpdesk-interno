const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userModel = require('../models/user.model');

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    // Look up the current user record (not just the JWT claims) so role,
    // department_id and is_active always reflect the latest state instead
    // of whatever was true when the token was issued.
    const user = await userModel.findById(payload.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
