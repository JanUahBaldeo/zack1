const express = require('express');
const router = express.Router();

// GET /production/overview - return placeholder production overview data
router.get('/overview', (req, res) => {
  res.json({
    overview: {
      totalLeads: 200,
      conversionRate: '18%',
      appointments: 35
    }
  });
});

module.exports = router; 