const express = require('express');
const router = express.Router();

// GET /calendar/events - return a placeholder events array
router.get('/events', (req, res) => {
  res.json({
    events: [
      { id: 1, title: 'Loan Meeting', date: '2024-07-23', time: '10:00' },
      { id: 2, title: 'Document Review', date: '2024-07-24', time: '14:00' }
    ]
  });
});

module.exports = router; 