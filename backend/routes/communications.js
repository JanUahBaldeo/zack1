const express = require('express');
const router = express.Router();

// GET /communications - return a placeholder communications array
router.get('/', (req, res) => {
  res.json({
    communications: [
      { id: 1, type: 'email', subject: 'Welcome!', date: '2024-07-22' },
      { id: 2, type: 'call', subject: 'Follow-up', date: '2024-07-21' }
    ]
  });
});

module.exports = router; 