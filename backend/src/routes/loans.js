const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/loans - Get all loans with filtering and pagination
router.get('/', [
  query('stage').optional(),
  query('status').optional(),
  query('loanOfficer').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      stage,
      status,
      loanOfficer,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    // Role-based filtering
    if (req.user.primaryRole === 'LO') {
      where.loanOfficerId = req.user.id;
    } else if (loanOfficer && req.user.permissions.includes('ADMIN')) {
      where.loanOfficerId = loanOfficer;
    }

    if (stage) where.currentStage = stage;
    if (status) where.status = status;

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          loanOfficer: {
            select: { id: true, name: true, email: true }
          },
          tasks: {
            where: { status: { not: 'COMPLETED' } },
            select: { id: true, title: true, priority: true, dueDate: true }
          },
          documents: {
            select: { id: true, name: true, status: true }
          },
          _count: {
            select: {
              communications: true,
              tasks: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: parseInt(offset),
        take: parseInt(limit)
      }),
      prisma.loan.count({ where })
    ]);

    res.json({
      loans,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/loans/:id - Get specific loan
router.get('/:id', async (req, res) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: req.params.id },
      include: {
        loanOfficer: {
          select: { id: true, name: true, email: true }
        },
        tasks: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        documents: true,
        communications: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        stageHistory: {
          orderBy: { enteredAt: 'desc' }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check permissions
    if (req.user.primaryRole === 'LO' && loan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(loan);
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/loans - Create new loan
router.post('/', [
  body('borrowerName').trim().isLength({ min: 2 }),
  body('borrowerEmail').optional().isEmail(),
  body('borrowerPhone').optional(),
  body('propertyAddress').trim().isLength({ min: 5 }),
  body('loanType').isIn(['CONVENTIONAL', 'FHA', 'VA', 'USDA', 'JUMBO']),
  body('loanAmount').isDecimal({ decimal_digits: '0,2' }),
  body('targetCloseDate').isISO8601(),
  body('currentStage').trim().isLength({ min: 1 })
], requireRole(['LO', 'LOA', 'ADMIN']), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      borrowerName,
      borrowerEmail,
      borrowerPhone,
      propertyAddress,
      loanType,
      loanAmount,
      targetCloseDate,
      currentStage,
      loanOfficerId
    } = req.body;

    // Generate loan number
    const timestamp = Date.now().toString().slice(-6);
    const loanNumber = `LN-${new Date().getFullYear()}-${timestamp}`;

    // Determine loan officer
    const finalLoanOfficerId = loanOfficerId || req.user.id;

    // Create loan with initial stage history
    const loan = await prisma.$transaction(async (tx) => {
      const newLoan = await tx.loan.create({
        data: {
          loanNumber,
          borrowerName,
          borrowerEmail,
          borrowerPhone,
          propertyAddress,
          loanType,
          loanAmount: parseFloat(loanAmount),
          targetCloseDate: new Date(targetCloseDate),
          currentStage,
          loanOfficerId: finalLoanOfficerId
        },
        include: {
          loanOfficer: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      // Create initial stage history
      await tx.stageHistory.create({
        data: {
          loanId: newLoan.id,
          stage: currentStage
        }
      });

      return newLoan;
    });

    res.status(201).json({
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/loans/:id - Update loan
router.put('/:id', [
  body('borrowerName').optional().trim().isLength({ min: 2 }),
  body('borrowerEmail').optional().isEmail(),
  body('propertyAddress').optional().trim().isLength({ min: 5 }),
  body('loanType').optional().isIn(['CONVENTIONAL', 'FHA', 'VA', 'USDA', 'JUMBO']),
  body('loanAmount').optional().isDecimal({ decimal_digits: '0,2' }),
  body('targetCloseDate').optional().isISO8601(),
  body('currentStage').optional().trim().isLength({ min: 1 }),
  body('status').optional().isIn(['ON_TRACK', 'DELAYED', 'AT_RISK']),
  body('progress').optional().isInt({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loanId = req.params.id;
    const updates = req.body;

    // Get current loan
    const currentLoan = await prisma.loan.findUnique({
      where: { id: loanId }
    });

    if (!currentLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check permissions
    if (req.user.primaryRole === 'LO' && currentLoan.loanOfficerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle stage change
    const loan = await prisma.$transaction(async (tx) => {
      // Update loan
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          ...updates,
          loanAmount: updates.loanAmount ? parseFloat(updates.loanAmount) : undefined,
          targetCloseDate: updates.targetCloseDate ? new Date(updates.targetCloseDate) : undefined
        },
        include: {
          loanOfficer: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      // If stage changed, update stage history
      if (updates.currentStage && updates.currentStage !== currentLoan.currentStage) {
        // Close previous stage
        await tx.stageHistory.updateMany({
          where: {
            loanId,
            exitedAt: null
          },
          data: {
            exitedAt: new Date(),
            duration: Math.floor((new Date() - new Date(currentLoan.updatedAt)) / (1000 * 60 * 60 * 24))
          }
        });

        // Create new stage entry
        await tx.stageHistory.create({
          data: {
            loanId,
            stage: updates.currentStage
          }
        });

        // Reset time in stage
        await tx.loan.update({
          where: { id: loanId },
          data: { timeInStage: 0 }
        });
      }

      return updatedLoan;
    });

    res.json({
      message: 'Loan updated successfully',
      loan
    });
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/loans/:id - Delete loan
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  try {
    const loanId = req.params.id;

    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.stageHistory.deleteMany({ where: { loanId } });
      await tx.communication.deleteMany({ where: { loanId } });
      await tx.document.deleteMany({ where: { loanId } });
      await tx.task.deleteMany({ where: { loanId } });
      
      // Delete the loan
      await tx.loan.delete({ where: { id: loanId } });
    });

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Loan not found' });
    }
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/loans/pipeline/stages - Get pipeline stages with counts
router.get('/pipeline/stages', async (req, res) => {
  try {
    const { loanOfficer } = req.query;
    
    const where = {};
    
    // Role-based filtering
    if (req.user.primaryRole === 'LO') {
      where.loanOfficerId = req.user.id;
    } else if (loanOfficer) {
      where.loanOfficerId = loanOfficer;
    }

    const stages = await prisma.loan.groupBy({
      by: ['currentStage'],
      where,
      _count: {
        id: true
      },
      _sum: {
        loanAmount: true
      }
    });

    res.json(stages);
  } catch (error) {
    console.error('Get pipeline stages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;