const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /users/me - get current user info
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: req.user });
});

// GET /users - list all users (admin only, example)
router.get('/', async (req, res) => {
  if (!req.user || !req.user.roles.includes('Admin')) return res.status(403).json({ error: 'Forbidden' });
  const users = await User.find({}, '-passwordHash');
  res.json({ users });
});

module.exports = router; 