const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/communications - Get communications with filtering
router.get('/', [
  query('loanId').optional().isUUID(),
  query('type').optional().isIn(['EMAIL', 'PHONE', 'SMS', 'MEETING', 'NOTE']),
  query('direction').optional().isIn(['inbound', 'outbound']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      loanId,
      type,
      direction,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (loanId) where.loanId = loanId;
    if (type) where.type = type;
    if (direction) where.direction = direction;

    // Filter by user's loans if LO
    if (req.user.primaryRole === 'LO') {
      where.loan = {
        loanOfficerId: req.user.id
      };
    } else {
      // For LOA and others, show communications they created or all if admin
      where.userId = req.user.id;
    }

    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        include: {
          loan: {
            select: {
              id: true,
              loanNumber: true,
              borrowerName: true,
              loanOfficer: {
                select: { id: true, name: true }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.communication.count({ where })
    ]);

    res.json({
      communications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/communications/recent - Get recent communications
router.get('/recent', [
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    const where = req.user.primaryRole === 'LO' 
      ? { loan: { loanOfficerId: userId } }
      : { userId };

    const communications = await prisma.communication.findMany({
      where,
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json(communications);
  } catch (error) {
    console.error('Get recent communications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/communications - Create new communication
router.post('/', [
  body('type').isIn(['EMAIL', 'PHONE', 'SMS', 'MEETING', 'NOTE']),
  body('message').trim().isLength({ min: 1 }),
  body('subject').optional().trim(),
  body('direction').isIn(['inbound', 'outbound']),
  body('loanId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, message, subject, direction, loanId } = req.body;

    // Verify loan exists and user has access if loanId provided
    if (loanId) {
      const loan = await prisma.loan.findUnique({
        where: { id: loanId }
      });

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      if (req.user.primaryRole === 'LO' && loan.loanOfficerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const communication = await prisma.communication.create({
      data: {
        type,
        message,
        subject,
        direction,
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Communication logged successfully',
      communication
    });
  } catch (error) {
    console.error('Create communication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/communications/:id - Update communication
router.put('/:id', [
  body('message').optional().trim().isLength({ min: 1 }),
  body('subject').optional().trim(),
  body('type').optional().isIn(['EMAIL', 'PHONE', 'SMS', 'MEETING', 'NOTE'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const communicationId = req.params.id;
    const updates = req.body;

    // Check if communication exists and user owns it
    const existingComm = await prisma.communication.findUnique({
      where: { id: communicationId },
      include: {
        loan: true
      }
    });

    if (!existingComm) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Check permissions
    const hasAccess = existingComm.userId === req.user.id || 
                     (req.user.primaryRole === 'LO' && existingComm.loan?.loanOfficerId === req.user.id) ||
                     req.user.primaryRole === 'ADMIN';

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const communication = await prisma.communication.update({
      where: { id: communicationId },
      data: updates,
      include: {
        loan: {
          select: {
            id: true,
            loanNumber: true,
            borrowerName: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Communication updated successfully',
      communication
    });
  } catch (error) {
    console.error('Update communication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/communications/:id - Delete communication
router.delete('/:id', async (req, res) => {
  try {
    const communicationId = req.params.id;

    // Check if communication exists and user owns it
    const communication = await prisma.communication.findUnique({
      where: { id: communicationId },
      include: {
        loan: true
      }
    });

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Check permissions
    const hasAccess = communication.userId === req.user.id || 
                     (req.user.primaryRole === 'LO' && communication.loan?.loanOfficerId === req.user.id) ||
                     req.user.primaryRole === 'ADMIN';

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.communication.delete({
      where: { id: communicationId }
    });

    res.json({ message: 'Communication deleted successfully' });
  } catch (error) {
    console.error('Delete communication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/communications/stats - Get communication statistics
router.get('/stats', [
  query('period').optional().isIn(['7d', '30d', '90d'])
], async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user.id;

    let daysBack = 30;
    switch (period) {
      case '7d': daysBack = 7; break;
      case '90d': daysBack = 90; break;
    }

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const where = {
      createdAt: { gte: startDate }
    };

    if (req.user.primaryRole === 'LO') {
      where.loan = { loanOfficerId: userId };
    } else {
      where.userId = userId;
    }

    const [
      totalCommunications,
      byType,
      byDirection,
      dailyActivity
    ] = await Promise.all([
      // Total communications
      prisma.communication.count({ where }),

      // By type
      prisma.communication.groupBy({
        by: ['type'],
        where,
        _count: { id: true }
      }),

      // By direction
      prisma.communication.groupBy({
        by: ['direction'],
        where,
        _count: { id: true }
      }),

      // Daily activity (simplified)
      prisma.communication.groupBy({
        by: ['createdAt'],
        where,
        _count: { id: true }
      })
    ]);

    res.json({
      period,
      totalCommunications,
      breakdown: {
        byType,
        byDirection
      },
      dailyActivity: dailyActivity.slice(0, 30) // Limit to last 30 entries
    });
  } catch (error) {
    console.error('Get communication stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;