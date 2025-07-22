const express = require('express');
const Loan = require('../models/Loan');

const router = express.Router();

// GET /loans - get all loans
router.get('/', async (req, res) => {
  const loans = await Loan.find().populate('assignedUsers', 'name email roles');
  res.json({ loans });
});

// GET /loans/:id - get loan by id
router.get('/:id', async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('assignedUsers', 'name email roles');
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  res.json({ loan });
});

// POST /loans - create loan
router.post('/', async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json({ loan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /loans/:id - update loan
router.patch('/:id', async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json({ loan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /loans/:id - delete loan
router.delete('/:id', async (req, res) => {
  const loan = await Loan.findByIdAndDelete(req.params.id);
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  res.json({ message: 'Loan deleted' });
});

module.exports = router; 