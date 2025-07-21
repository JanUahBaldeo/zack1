const express = require('express');
const { query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { subDays, startOfDay, endOfDay } = require('date-fns');

const router = express.Router();

// GET /api/dashboard/overview - Get dashboard overview data
router.get('/overview', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.primaryRole;

    // Base filters based on role
    const loanFilter = userRole === 'LO' ? { loanOfficerId: userId } : {};
    const taskFilter = { userId };

    const [
      totalLoans,
      activePipeline,
      overdueTasks,
      upcomingTasks,
      recentCommunications,
      monthlyStats
    ] = await Promise.all([
      // Total loans count
      prisma.loan.count({ where: loanFilter }),

      // Active pipeline by stage
      prisma.loan.groupBy({
        by: ['currentStage', 'status'],
        where: {
          ...loanFilter,
          currentStage: { not: 'Closed' }
        },
        _count: { id: true },
        _sum: { loanAmount: true }
      }),

      // Overdue tasks
      prisma.task.findMany({
        where: {
          ...taskFilter,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' }
        },
        include: {
          loan: {
            select: { id: true, borrowerName: true, loanNumber: true }
          }
        },
        orderBy: { dueDate: 'asc' },
        take: 10
      }),

      // Upcoming tasks (next 7 days)
      prisma.task.findMany({
        where: {
          ...taskFilter,
          dueDate: {
            gte: new Date(),
            lte: subDays(new Date(), -7)
          },
          status: { not: 'COMPLETED' }
        },
        include: {
          loan: {
            select: { id: true, borrowerName: true, loanNumber: true }
          }
        },
        orderBy: { dueDate: 'asc' },
        take: 10
      }),

      // Recent communications
      prisma.communication.findMany({
        where: userRole === 'LO' ? {
          loan: { loanOfficerId: userId }
        } : {},
        include: {
          loan: {
            select: { id: true, borrowerName: true, loanNumber: true }
          },
          user: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Monthly performance stats
      prisma.loan.groupBy({
        by: ['status'],
        where: {
          ...loanFilter,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _count: { id: true },
        _sum: { loanAmount: true }
      })
    ]);

    res.json({
      summary: {
        totalLoans,
        activeLoans: activePipeline.reduce((sum, stage) => sum + stage._count.id, 0),
        overdueTasks: overdueTasks.length,
        upcomingTasks: upcomingTasks.length
      },
      pipeline: activePipeline,
      tasks: {
        overdue: overdueTasks,
        upcoming: upcomingTasks
      },
      recentCommunications,
      monthlyStats
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dashboard/performance - Get performance metrics
router.get('/performance', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']),
  query('role').optional().isIn(['LO', 'LOA', 'PRODUCTION_PARTNER'])
], async (req, res) => {
  try {
    const { period = '30d', role } = req.query;
    const userId = req.user.id;
    const userRole = req.user.primaryRole;

    // Calculate date range
    let daysBack = 30;
    switch (period) {
      case '7d': daysBack = 7; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
    }

    const startDate = subDays(new Date(), daysBack);
    const loanFilter = userRole === 'LO' ? { loanOfficerId: userId } : {};

    const [
      closedLoans,
      averageTimeToClose,
      conversionRates,
      taskCompletion,
      communicationVolume
    ] = await Promise.all([
      // Closed loans in period
      prisma.loan.findMany({
        where: {
          ...loanFilter,
          currentStage: 'Closed',
          updatedAt: { gte: startDate }
        },
        select: {
          id: true,
          loanAmount: true,
          createdAt: true,
          updatedAt: true,
          borrowerName: true
        }
      }),

      // Average time to close
      prisma.loan.aggregate({
        where: {
          ...loanFilter,
          currentStage: 'Closed',
          updatedAt: { gte: startDate }
        },
        _avg: {
          timeInStage: true
        }
      }),

      // Conversion rates by stage
      prisma.stageHistory.groupBy({
        by: ['stage'],
        where: {
          loan: loanFilter,
          enteredAt: { gte: startDate }
        },
        _count: { id: true }
      }),

      // Task completion rate
      prisma.task.groupBy({
        by: ['status'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: { id: true }
      }),

      // Communication volume
      prisma.communication.groupBy({
        by: ['type'],
        where: userRole === 'LO' ? {
          loan: { loanOfficerId: userId },
          createdAt: { gte: startDate }
        } : {
          createdAt: { gte: startDate }
        },
        _count: { id: true }
      })
    ]);

    // Calculate metrics
    const totalVolume = closedLoans.reduce((sum, loan) => sum + Number(loan.loanAmount), 0);
    const completedTasks = taskCompletion.find(t => t.status === 'COMPLETED')?._count.id || 0;
    const totalTasks = taskCompletion.reduce((sum, t) => sum + t._count.id, 0);

    res.json({
      period,
      metrics: {
        closedLoans: closedLoans.length,
        totalVolume,
        averageTimeToClose: averageTimeToClose._avg.timeInStage || 0,
        taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      },
      closedLoans,
      conversionRates,
      taskCompletion,
      communicationVolume
    });
  } catch (error) {
    console.error('Dashboard performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dashboard/analytics - Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.primaryRole;

    const [
      dailyActivity,
      stageDistribution,
      loanTypeBreakdown,
      monthlyTrends
    ] = await Promise.all([
      // Daily activity for last 30 days
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM tasks 
        WHERE user_id = ${userId}
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `,

      // Current stage distribution
      prisma.loan.groupBy({
        by: ['currentStage'],
        where: userRole === 'LO' ? { loanOfficerId: userId } : {},
        _count: { id: true },
        _sum: { loanAmount: true }
      }),

      // Loan type breakdown
      prisma.loan.groupBy({
        by: ['loanType'],
        where: userRole === 'LO' ? { loanOfficerId: userId } : {},
        _count: { id: true },
        _sum: { loanAmount: true }
      }),

      // Monthly trends for last 12 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as loan_count,
          SUM(loan_amount) as total_amount
        FROM loans 
        WHERE ${userRole === 'LO' ? prisma.sql`loan_officer_id = ${userId}` : prisma.sql`1=1`}
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
      `
    ]);

    res.json({
      dailyActivity,
      stageDistribution,
      loanTypeBreakdown,
      monthlyTrends
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dashboard/notifications - Get user notifications
router.get('/notifications', [
  query('unread').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { unread, limit = 20 } = req.query;
    const userId = req.user.id;

    const where = { userId };
    if (unread === 'true') {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Dashboard notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dashboard/notifications/:id/read - Mark notification as read
router.post('/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId
      },
      data: {
        isRead: true
      }
    });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notification not found' });
    }
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;