const express = require('express');
const router = express.Router();

// GET /marketing/lead-analytics - return placeholder lead analytics
router.get('/lead-analytics', (req, res) => {
  res.json({
    analytics: [
      { id: 1, source: 'Facebook', leads: 50 },
      { id: 2, source: 'Referral', leads: 30 }
    ]
  });
});

// GET /marketing/metrics - return placeholder marketing metrics
router.get('/metrics', (req, res) => {
  res.json({
    metrics: [
      { id: 1, name: 'Open Rate', value: '45%' },
      { id: 2, name: 'CTR', value: '12%' }
    ]
  });
});

module.exports = router; 