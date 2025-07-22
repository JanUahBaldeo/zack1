const express = require('express');
const router = express.Router();

// GET /notifications - return a placeholder notifications array
router.get('/', (req, res) => {
  res.json({
    notifications: [
      { id: 1, message: 'New document uploaded', type: 'info', read: false },
      { id: 2, message: 'Task deadline approaching', type: 'warning', read: true }
    ]
  });
});

module.exports = router; 