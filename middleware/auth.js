const jwt = require('jsonwebtoken');
const secret = 'mysecret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'authorization required' });
  }
  const token = parts[1];

  try {
    const verify = jwt.verify(token, secret);
    req.user = verify; 
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
}

module.exports = authMiddleware;
