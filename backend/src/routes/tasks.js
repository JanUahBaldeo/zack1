const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/tasks - Get tasks with filtering
router.get('/', [
  query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  query('category').optional(),
  query('loanId').optional().isUUID(),
  query('overdue').optional().isBoolean(),
  query('dueToday').optional().isBoolean(),
  query('upcoming').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      priority,
      category,
      loanId,
      overdue,
      dueToday,
      upcoming,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    // Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (loanId) where.loanId = loanId;

    // Date-based filters
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    if (overdue === 'true') {
      where.dueDate = { lt: startOfToday };
      where.status = { not: 'COMPLETED' };
    }

    if (dueToday === 'true') {
      where.dueDate = {
        gte: startOfToday,
        lt: endOfToday
      };
    }

    if (upcoming === 'true') {
      where.dueDate = {
        gte: endOfToday,
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          loan: {
            select: {
              id: true,
              loanNumber: true,
              borrowerName: true,
              currentStage: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/summary - Get task summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [
      overdue,
      dueToday,
      upcoming,
      completed,
      byCategory,
      byPriority
    ] = await Promise.all([
      // Overdue tasks
      prisma.task.count({
        where: {
          userId,
          dueDate: { lt: startOfToday },
          status: { not: 'COMPLETED' }
        }
      }),

      // Due today
      prisma.task.count({
        where: {
          userId,
          dueDate: { gte: startOfToday, lt: endOfToday },
          status: { not: 'COMPLETED' }
        }
      }),

      // Upcoming (next 7 days)
      prisma.task.count({
        where: {
          userId,
          dueDate: {
            gte: endOfToday,
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          status: { not: 'COMPLETED' }
        }
      }),

      // Completed this week
      prisma.task.count({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),

      // By category
      prisma.task.groupBy({
        by: ['category'],
        where: { userId, status: { not: 'COMPLETED' } },
        _count: { id: true }
      }),

      // By priority
      prisma.task.groupBy({
        by: ['priority'],
        where: { userId, status: { not: 'COMPLETED' } },
        _count: { id: true }
      })
    ]);

    res.json({
      summary: {
        overdue,
        dueToday,
        upcoming,
        completedThisWeek: completed
      },
      breakdown: {
        byCategory,
        byPriority
      }
    });
  } catch (error) {
    console.error('Get task summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Create new task
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('category').trim().isLength({ min: 1 }),
  body('type').trim().isLength({ min: 1 }),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate').optional().isISO8601(),
  body('loanId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      type,
      priority,
      dueDate,
      loanId
    } = req.body;

    // Verify loan exists if provided
    if (loanId) {
      const loan = await prisma.loan.findUnique({
        where: { id: loanId }
      });

      if (!loan) {
        return res.status(400).json({ error: 'Loan not found' });
      }

      // Check permissions for LO role
      if (req.user.primaryRole === 'LO' && loan.loanOfficerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        type,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        loanId,
        userId: req.user.id
      },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('category').optional().trim().isLength({ min: 1 }),
  body('type').optional().trim().isLength({ min: 1 }),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  body('dueDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskId = req.params.id;
    const updates = req.body;

    // Check if task exists and user owns it
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (existingTask.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle completion
    if (updates.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      updates.completedAt = new Date();
    } else if (updates.status !== 'COMPLETED') {
      updates.completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined
      },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if task exists and user owns it
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id/complete - Mark task as complete
router.put('/:id/complete', async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      },
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        }
      }
    });

    res.json({
      message: 'Task completed successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;