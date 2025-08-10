const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secret = 'mysecret';

const user = {
  email: 'test@example.com',
  password: '123456',
  id: 'user-1'
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    if (email !== user.email || password !== user.password) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const data = { sub: user.id, email: user.email };
    const token = jwt.sign(data, secret, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'login failed' });
  }
});

module.exports = router;
