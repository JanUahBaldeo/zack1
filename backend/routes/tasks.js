const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// GET /tasks - get all tasks (optionally filter by assignedTo or loanId)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
  if (req.query.loanId) filter.loanId = req.query.loanId;
  const tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('loanId', 'loanNumber');
  res.json({ tasks });
});

// GET /tasks/:id - get task by id
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('loanId', 'loanNumber');
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ task });
});

// POST /tasks - create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /tasks/:id - update task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id - delete task
router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router; 