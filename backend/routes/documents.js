const express = require('express');
const router = express.Router();

// GET /documents/checklist - return a placeholder checklist
router.get('/checklist', (req, res) => {
  res.json({
    checklist: [
      { id: 1, name: 'ID Proof', status: 'received' },
      { id: 2, name: 'Income Statement', status: 'pending' },
      { id: 3, name: 'Credit Report', status: 'received' }
    ]
  });
});

module.exports = router; 