const express = require('express');
const router = express.Router();

// GET /campaigns - return a placeholder campaigns array
router.get('/', (req, res) => {
  res.json({
    campaigns: [
      { id: 1, name: 'Spring Promo', status: 'active', leads: 120 },
      { id: 2, name: 'Referral Drive', status: 'paused', leads: 45 }
    ]
  });
});

module.exports = router; 